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
import { motion } from "framer-motion";
import Footer from "./(components)/footer";

export default function Home() {
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
      let nodes = new vis.DataSet(
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
      let edges = new vis.DataSet(
        graph.flatMap((item) => {
          const destinations = item.edgeValue.split(",");

          return destinations.map((dest) => {
            const destinationNodeMatch = dest.match(/[A-Za-z]+/);
            const weightMatch = dest.match(/\d+/);
            const destination_node_index = find_index(
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
      let container = document.getElementById("mynetwork");
      let container2 = document.getElementById("mynetwork_2");

      // provide the data in the vis format
      let data = {
        nodes: nodes,
        edges: edges,
      };
      let options = {
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
      //@ts-ignore
      new vis.Network(container2, data, options);

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
    <div className="flex flex-col">
      <div className="grid grid-cols-12 h-screen flex-1">
        <div className="left-cont xl:col-span-3 border-e-2 border-gray-300">
          <motion.h1
            initial={{
              opacity: 0,
              y: -50,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="text-2xl p-5 border-b-2 border-gray-300 font-bold"
          >
            <span className="bg-slate-300 p-2 rounded-s-md">GraphRoute</span>
            <span className="bg-black text-white p-2 rounded-e-md">
              Decoder
            </span>
          </motion.h1>
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
        <div className="right-cont xl:col-span-9 h-screen ">
          <div className="flex p-3 justify-between">
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              className="instr-cont flex justify-center gap-10 border p-4 border-gray-400 rounded text-left select-none bg-[#ededed] z-10"
            >
              <div className="lg:w-[300px] xl:w-[450px]">
                <h1 className="font-bold text-red-500">Instructions*</h1>
                <ul className="ps-3">
                  <li>
                    Every node in the edge list must have a corresponding node.
                  </li>
                  <li>
                    Enter edge in the form of comma separated {"(node weight)"}.
                  </li>
                  <li>
                    <strong>Source</strong> & <strong>Destination</strong> must
                    be a node.
                  </li>
                </ul>
              </div>
              <div className="">
                <h1 className="font-bold text-red-500">Fun tips*</h1>
                <ul>
                  <li>You can move nodes with pointer.</li>
                  <li>You zoom in-out graph.</li>
                </ul>
              </div>
            </motion.div>
            <Button
              className="rebuild-btn-1"
              onClick={() => setReBuild(!rebuild)}
            >
              Rebuild
            </Button>
          </div>
          <div className="canvas_1">
            <div id="mynetwork"></div>
          </div>
        </div>
        <div className="bottom-cont">
          <div className="flex justify-center items-center p-5">
            <Button
              className="rebuild-btn-2 xl:hidden"
              onClick={() => setReBuild(!rebuild)}
            >
              Rebuild
            </Button>
          </div>
          <div className="canvas_2">
            <div id="mynetwork_2"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
