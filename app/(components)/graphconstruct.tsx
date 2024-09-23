"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { graphState } from "../(recoil)";
import { sourceState } from "../(recoil)";
import { destState } from "../(recoil)";
import { pathState } from "../(recoil)";
import { distanceState } from "../(recoil)";
import { useRecoilState,useSetRecoilState } from "recoil";
import axios from "axios";

function Graphconstruct() {
  const [nodes, setNodes] = useRecoilState(graphState);
  const [source, setSource] = useRecoilState(sourceState);
  const [dest, setDest] = useRecoilState(destState);
  const setPath = useSetRecoilState(pathState);
  const setDistance = useSetRecoilState(distanceState);

  const addNode = () => {
    setNodes([
      ...nodes,
      { id: nodes.length + 1, nodeValue: "", edgeValue: "" },
    ]);
  };

  const removeNode = (id: number) => {
    const updatedNodes = nodes.filter((node) => node.id !== id);
    const reassignedNodes = updatedNodes.map((node, index) => ({
      ...node,
      id: index + 1,
    }));
    setNodes(reassignedNodes);
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setNodes(
      nodes.map((node) => (node.id === id ? { ...node, [field]: value } : node))
    );
  };

  const validDijsktraInput = (value: string) => {
    // checking if the value is empty
    if (value.trim() == "") {
      return true;
    }
    const check = /^[A-Z]?$/.test(value);
    if (!check) return false;

    // checking if the value is present in the node of the graph or not
    const node = nodes.find((node) => node.nodeValue === value);
    if (!node) return false;
    return true;
  };

  const validateNodeInput = (value: string) => {
    return /^[A-Z]?$/.test(value);
  };

  const isDuplicateNode = (value: string) => {
    return nodes.some((node) => node.nodeValue === value);
  };

  const handleNodeValueChange = (id: number, value: string) => {
    if (validateNodeInput(value)) {
      if (isDuplicateNode(value)) {
        alert(
          `Node value "${value}" is already entered. Please choose a different value.`
        );
      } else {
        handleInputChange(id, "nodeValue", value);
      }
    }
  };

  const handleEdgeValueChange = (id: number, value: string) => {
    handleInputChange(id, "edgeValue", value);
  };

  // handle the submit button
  const handleSubmit = async () => {
    if (!source && !dest) {
      alert("Please select source and destination nodes");
      return;
    }
    try {
      const response = await axios.post("/api/dijsktra", {
        nodes,
        source,
        dest,
      });
      setPath(response.data.output.pathVector)
      setDistance(response.data.output.shortestDistance);
    } catch (error) {
      console.log("error occured while executing the code: ", error);
    }
  };

  return (
    <div className="p-5">
      {/* {JSON.stringify(nodes)} */}
      {nodes.map((node) => (
        <Node_edge
          key={node.id}
          id={node.id}
          nodeValue={node.nodeValue}
          edgeValue={node.edgeValue}
          onNodeValueChange={handleNodeValueChange}
          onEdgeValueChange={handleEdgeValueChange}
          removeNode={removeNode}
        />
      ))}
      <Button onClick={addNode} className="w-full mt-4">
        Add Node
      </Button>
      <div className="flex justify-center items-center gap-5 mt-5">
        <div>
          <Label htmlFor="source">
            <strong>Source</strong>
          </Label>
          <Input
            type="text"
            id="source"
            placeholder="A"
            className="mt-1"
            value={source}
            onChange={(e) => {
              if (validDijsktraInput(e.target.value.toUpperCase())) {
                setSource(e.target.value.toUpperCase());
              } else {
                // alert the user to enter the value from the nodes
                alert("Please enter a value from the nodes");
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="dest">
            <strong>Destination</strong>
          </Label>
          <Input
            type="text"
            id="dest"
            placeholder="D"
            className="mt-1"
            value={dest}
            onChange={(e) => {
              if (validDijsktraInput(e.target.value.toUpperCase())) {
                setDest(e.target.value.toUpperCase());
              } else {
                // alert the user to enter the value from the nodes
                alert("Please enter a value from the nodes");
              }
            }}
          />
        </div>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

function Node_edge({
  id,
  nodeValue,
  edgeValue,
  onNodeValueChange,
  onEdgeValueChange,
  removeNode,
}: {
  id: number;
  nodeValue: string;
  edgeValue: string;
  onNodeValueChange: (id: number, value: string) => void;
  onEdgeValueChange: (id: number, value: string) => void;
  removeNode: (id: number) => void;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="w-16">
          {id === 1 ? (
            <Label htmlFor={`node-${id}`}>
              <strong>Node</strong>
            </Label>
          ) : (
            ""
          )}
          <Input
            type="text"
            id={`node-${id}`}
            placeholder="A"
            className="mt-1"
            value={nodeValue}
            onChange={(e) =>
              onNodeValueChange(id, e.target.value.toUpperCase())
            }
          />
        </div>
        <div className="w-2/3">
          {id === 1 ? (
            <Label htmlFor={`edge-${id}`}>
              <strong>Edge List</strong> eg: {"A5,B11,C7"}
            </Label>
          ) : (
            ""
          )}
          <Input
            type="text"
            id={`edge-${id}`}
            placeholder="eg: A5,B11,C7"
            className="mt-1"
            value={edgeValue}
            onChange={(e) =>
              onEdgeValueChange(id, e.target.value.toUpperCase())
            }
          />
        </div>
        <div onClick={() => (id !== 1 ? removeNode(id) : undefined)}>
          {id === 1 ? <p className="opacity-0">{"__"}</p> : ""}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </>
  );
}

export default Graphconstruct;
