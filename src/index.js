import { createRoot } from "react-dom/client";
import * as React from "react";
import {
  LayoutAnimation,
  HierarchicalTree,
  DataBinding,
  DiagramComponent,
  ConnectorConstraints,
  SnapConstraints,
  Inject,
  DiagramTools,
} from "@syncfusion/ej2-react-diagrams";

import { DataManager } from "@syncfusion/ej2-data";
import { apiJSONData } from "./diagram-data";
const SAMPLE_CSS = `
/* Property panel orientation and sub tree alignment */
.image-pattern-style {
        background-color: white;
        background-size: contain;
        background-repeat: no-repeat;
        height: 75px;
        width: calc((100% - 18px) / 3);
        cursor: pointer;
        border: 1px solid #D5D5D5;
        background-position: center;
        float: left;
    }

    .image-pattern-style:hover {
        border-color: gray;
        border-width: 2px;
    }

    .row {
        margin-left: 0px;
        margin-right: 0px;
    }

    .row-header {
        font-size: 13px;
        font-weight: 500;
    }

    .row-header1 {
        font-size: 12px;
        padding-left: 2px;
        font-weight: 400;
    }

    .property-panel-header {
      padding-top: 15px;
      padding-bottom: 15px;
    }

    .e-selected-orientation-style {
        border-color: #006CE6;
        border-width: 2px;
    }

    .e-selected-pattern-style {
        border-color: #006CE6;
        border-width: 2px;
    }

    .e-checkbox-wrapper .e-label {
        font-size: 12px;
    }

    .diagram-control-pane .col-xs-6 {
        padding-left: 0px;
        padding-right: 0px;
    }`;

const final = [];
const getFormattedData = (apiJSONData, manager) => {
  if (apiJSONData?.organisationMember?.length > 0) {
    const om = apiJSONData?.organisationMember;
    const ownerDetails = om?.filter((values) => values.isOwner);

    for (let i = 0; i < om?.length; i++) {
      const orgItemData = {
        Id:
          "" +
          om[i]?.userDetails?.userDetailsId +
          "" +
          om[i]?.organisation?.organisationId,
        displayName: om[i]?.organisation?.displayName,
        userName: om[i]?.userDetails?.userName,
        Manager: om[i]?.isOwner
          ? manager
          : "" +
            ownerDetails[0]?.userDetails?.userDetailsId +
            "" +
            ownerDetails[0]?.organisation?.organisationId,
        color: "#71AF17",
      };

      final.push(orgItemData);
    }

    if (apiJSONData?.childOrg?.length) {
      for (let i = 0; i < apiJSONData?.childOrg?.length; i++) {
        getFormattedData(
          apiJSONData?.childOrg[i],
          "" +
            ownerDetails[i]?.userDetails?.userDetailsId +
            "" +
            ownerDetails[i]?.organisation?.organisationId
        );
      }
    }
    return final;
  }
};

let diagramInstance;
function OrganizationModel() {
  //sets default value for Node.
  function nodeDefaults(obj, diagram) {
    obj.backgroundColor = obj.data.color;
    obj.style = { fill: "none", strokeColor: "none", color: "white" };
    obj.expandIcon = {
      height: 10,
      width: 10,
      shape: "None",
      fill: "lightgray",
      offset: { x: 0.5, y: 1 },
    };
    obj.expandIcon.verticalAlignment = "Center";
    obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
    obj.collapseIcon.offset = { x: 0.5, y: 1 };
    obj.collapseIcon.verticalAlignment = "Center";
    obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
    obj.collapseIcon.height = 10;
    obj.collapseIcon.width = 10;
    obj.collapseIcon.shape = "None";
    obj.collapseIcon.fill = "lightgray";
    obj.width = 120;
    obj.height = 50;
    return obj;
  }
  //sets default value for Connector.
  function connectorDefaults(connector, diagram) {
    connector.targetDecorator.shape = "None";
    connector.type = "Orthogonal";
    connector.constraints = ConnectorConstraints.None;
    connector.cornerRadius = 0;
    return connector;
  }
  return (
    <div className="control-pane diagram-control-pane">
      <style>{SAMPLE_CSS}</style>
      <div className="col-lg-11 control-section">
        <div className="content-wrapper" style={{ width: "100%" }}>
          <DiagramComponent
            id="diagram"
            ref={(diagram) => (diagramInstance = diagram)}
            width={"100%"}
            height={"700px"}
            snapSettings={{ constraints: SnapConstraints.None }}
            //configures data source settings
            dataSourceSettings={{
              id: "Id",
              parentId: "Manager",
              dataSource: new DataManager(getFormattedData(apiJSONData)),
              doBinding: (nodeModel, data, diagram) => {
                nodeModel.shape = {
                  type: "HTML",
                  content: `<div><p>${data.displayName}</p><p>${data.userName}</p></div>`,
                  margin: { left: 10, right: 10, top: 10, bottom: 10 },
                };
              },
            }}
            //Disables all interactions except zoom/pan
            tool={DiagramTools.ZoomPan}
            //Configures automatic layout
            layout={{
              type: "OrganizationalChart",
              getLayoutInfo: (node, options) => {
                if (!options.hasSubTree) {
                  options.type = "Right";
                }
              },
            }}
            //Defines the default node and connector properties
            getNodeDefaults={(obj, diagram) => {
              /* tslint:disable:no-string-literal */
              return nodeDefaults(obj, diagram);
            }}
            getConnectorDefaults={(connector, diagram) => {
              return connectorDefaults(connector, diagram);
            }}
          >
            <Inject
              services={[DataBinding, HierarchicalTree, LayoutAnimation]}
            />
          </DiagramComponent>
        </div>
      </div>

      <div
        className="col-lg-1 property-section"
        style={{ float: "right", height: "80%" }}
      >
        <div className="property-panel-header">Properties</div>
        <div className="row property-panel-content" id="appearance">
          <div className="row" style={{ paddingTop: "10px" }}>
            <div id="orientation"></div>

            <div id="pattern"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrganizationModel;

const root = createRoot(document.getElementById("sample"));
root.render(<OrganizationModel />);
