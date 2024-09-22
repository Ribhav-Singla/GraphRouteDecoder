"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Graphconstruct from "./(components)/graphconstruct";
import { graphState } from "./(recoil)";
import { sourceState } from "./(recoil)";
import { destState } from "./(recoil)";
import { distanceState } from "./(recoil)";
import { pathState } from "./(recoil)";
import { useRecoilValue } from "recoil";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [rebuild, setReBuild] = useState(false);
  const graph = useRecoilValue(graphState);
  const source = useRecoilValue(sourceState);
  const dest = useRecoilValue(destState);
  const distance = useRecoilValue(distanceState);
  const path = useRecoilValue(pathState);

  useEffect(() => {
    const loadFontAwesome = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
      document.head.appendChild(link);
    };

    loadFontAwesome(); // Load FontAwesome

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js";
    script.async = true;
    script.onload = () => {
      // create an array with nodes
      //@ts-ignore
      var nodes = new vis.DataSet(
        graph.map((item) => {
          if (item.nodeValue) {
            return {
              id: item.id,
              label: item.nodeValue,
              color:
                item.nodeValue.trim() == source.trim()
                  ? "green"
                  : item.nodeValue.trim() == dest.trim()
                  ? "red"
                  : "black",
              font: {
                size: 18,
                face: "Arial",
                color: "white",
              },
              // image: item.nodeValue.trim() == source.trim() ? '/marker.png' : '',
              // shape: item.nodeValue.trim() == source.trim() ? 'image' : 'ellipse'
            };
          }
        })
      );

      function find_index(node: string) {
        return graph.findIndex((item) => item.nodeValue === node) + 1;
      }

      // create an array with edges
      //@ts-ignore
      var edges = new vis.DataSet(
        graph.flatMap((item, index) => {
          let destinations = item.edgeValue.split(",");

          return destinations.map((dest, destIndex) => {
            let destinationNodeMatch = dest.match(/[A-Za-z]+/);
            let weightMatch = dest.match(/\d+/);
            let destination_node_index = find_index(
              destinationNodeMatch ? destinationNodeMatch[0].trim() : ""
            );

            console.log("edge vector:", `${item.id}-${destination_node_index}`);

            return {
              id: `${item.id}-${destination_node_index}`,
              from: item.id,
              to: destination_node_index,
              label: weightMatch && weightMatch[0] ? weightMatch[0] : 0,
              font: {
                align: "top",
                size: 18,
              },
              color: { color: "black" },
              arrows: "to",
            };
          });
        })
      );

      // create a network
      var container = document.getElementById("mynetwork");

      // provide the data in the vis format
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -8000, // Adjust for spacing
            springLength: 200, // Adjust edge length
            springConstant: 0.08,
          },
          repulsion: {
            centralGravity: 0.1,
            springLength: 200,
            springConstant: 0.1,
          },
        },
      };

      // initialize your network!
      //@ts-ignore
      new vis.Network(container, data, options);

      // Animation of the path movement
      let step = 0;
      const animatePath = () => {
        if (step < path.length - 1) {
          const currentNode = find_index(path[step]);
          const nextNode = find_index(path[step + 1]);
          console.log("cur: ", currentNode, nextNode);

          // Move image to the next node
          nodes.update([
            {
              id: currentNode,
              shape: "ellipse",
              font: {
                color: "white",
              },
            },
            {
              id: nextNode,
              shape: "icon",
              icon: {
                face: "FontAwesome",
                code: "\uf183",
                size: 30,
                color: step + 1 == path.length - 1 ? "red" : "green",
              },
              font: {
                color: "black",
              },
            },
          ]);

          // Change edge color
          edges.update([
            {
              id: `${currentNode}-${nextNode}`,
              color: { color: "green" },
              width: 4,
            },
          ]);

          step++;

          // Repeat until the destination is reached
          setTimeout(animatePath, 1000); // 1-second interval between steps
        }
      };

      // Start animation after a slight delay
      setTimeout(animatePath, 500);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [rebuild, graph, source, dest, path]);

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-3 border-e-2 border-gray-300">
        <h1 className="text-2xl p-5 border-b-2 border-gray-300 font-bold">
          Dijkstra&apos;s Algorithm
        </h1>
        <Graphconstruct />
        <div className="p-5">
          <p>
            <strong>
              <span className="text-blue-600">Shortest Path: </span>{" "}
              {path.join(" ")}
            </strong>
          </p>
          <p>
            <strong>
              <span className="text-blue-600">Shortest Distance:</span>{" "}
              {distance} units
            </strong>
          </p>
        </div>
      </div>
      <div className="col-span-9 relative">
        <div id="mynetwork" className="h-screen"></div>
        <div className="absolute top-2 left-[3%] flex justify-center border p-4 border-gray-400 rounded text-justify select-none bg-[#ededed] z-10">
          <div>
            <h1 className="font-bold text-red-500">Instructions*</h1>
            <p>
              &#x25CF; Every node in the edge list must have a corresponding
              node.
            </p>
            <p>
              &#x25CF; Enter edge in the form of comma separated{" "}
              {"(node weight)"}.
            </p>
            <p>
              &#x25CF; <strong>Source</strong> & <strong>Destination</strong>{" "}
              must be a node.
            </p>
          </div>
          <div className="ps-5">
            <h1 className="font-bold text-red-500">Fun tips*</h1>
            <p>&#x25CF; You can move nodes with pointer.</p>
            <p>&#x25CF; You zoom in-out graph.</p>
          </div>
        </div>
        <Button
          className="absolute top-2 left-[92%]"
          onClick={() => setReBuild(!rebuild)}
        >
          Rebuild
        </Button>
      </div>
    </div>
  );
}
