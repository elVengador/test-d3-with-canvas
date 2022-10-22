import { useCallback, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import * as d3 from "d3"
const data = {
  "nodes": [
    {
      "id": "Microsoft"
    },
    {
      "id": "Amazon"
    },
    {
      "id": "HTC"
    },
    {
      "id": "Samsung"
    },
    {
      "id": "Apple"
    },
    {
      "id": "Motorola"
    },
    {
      "id": "Nokia"
    },
    {
      "id": "Kodak"
    },
    {
      "id": "Barnes & Noble"
    },
    {
      "id": "Foxconn"
    },
    {
      "id": "Oracle"
    },
    {
      "id": "Google"
    },
    {
      "id": "Inventec"
    },
    {
      "id": "LG"
    },
    {
      "id": "RIM"
    },
    {
      "id": "Sony"
    },
    {
      "id": "Qualcomm"
    },
    {
      "id": "Huawei"
    },
    {
      "id": "ZTE"
    },
    {
      "id": "Ericsson"
    }
  ],
  "links": [
    {
      "source": "Microsoft",
      "target": "Amazon",
      "type": "licensing"
    },
    {
      "source": "Microsoft",
      "target": "HTC",
      "type": "licensing"
    },
    {
      "source": "Samsung",
      "target": "Apple",
      "type": "suit"
    },
    {
      "source": "Motorola",
      "target": "Apple",
      "type": "suit"
    },
    {
      "source": "Nokia",
      "target": "Apple",
      "type": "resolved"
    },
    {
      "source": "HTC",
      "target": "Apple",
      "type": "suit"
    },
    {
      "source": "Kodak",
      "target": "Apple",
      "type": "suit"
    },
    {
      "source": "Microsoft",
      "target": "Barnes & Noble",
      "type": "suit"
    },
    {
      "source": "Microsoft",
      "target": "Foxconn",
      "type": "suit"
    },
    {
      "source": "Oracle",
      "target": "Google",
      "type": "suit"
    },
    {
      "source": "Apple",
      "target": "HTC",
      "type": "suit"
    },
    {
      "source": "Microsoft",
      "target": "Inventec",
      "type": "suit"
    },
    {
      "source": "Samsung",
      "target": "Kodak",
      "type": "resolved"
    },
    {
      "source": "LG",
      "target": "Kodak",
      "type": "resolved"
    },
    {
      "source": "RIM",
      "target": "Kodak",
      "type": "suit"
    },
    {
      "source": "Sony",
      "target": "LG",
      "type": "suit"
    },
    {
      "source": "Kodak",
      "target": "LG",
      "type": "resolved"
    },
    {
      "source": "Apple",
      "target": "Nokia",
      "type": "resolved"
    },
    {
      "source": "Qualcomm",
      "target": "Nokia",
      "type": "resolved"
    },
    {
      "source": "Apple",
      "target": "Motorola",
      "type": "suit"
    },
    {
      "source": "Microsoft",
      "target": "Motorola",
      "type": "suit"
    },
    {
      "source": "Motorola",
      "target": "Microsoft",
      "type": "suit"
    },
    {
      "source": "Huawei",
      "target": "ZTE",
      "type": "suit"
    },
    {
      "source": "Ericsson",
      "target": "ZTE",
      "type": "suit"
    },
    {
      "source": "Kodak",
      "target": "Samsung",
      "type": "resolved"
    },
    {
      "source": "Apple",
      "target": "Samsung",
      "type": "suit"
    },
    {
      "source": "Kodak",
      "target": "RIM",
      "type": "suit"
    },
    {
      "source": "Nokia",
      "target": "Qualcomm",
      "type": "suit"
    }
  ]
}



function App() {
  const [count, setCount] = useState(0)
  function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
  }

  // const drag = simulation => {

  //   function dragstarted(event, d) {
  //     if (!event.active) simulation.alphaTarget(0.3).restart();
  //     d.fx = d.x;
  //     d.fy = d.y;
  //   }

  //   function dragged(event, d) {
  //     d.fx = event.x;
  //     d.fy = event.y;
  //   }

  //   function dragended(event, d) {
  //     if (!event.active) simulation.alphaTarget(0);
  //     d.fx = null;
  //     d.fy = null;
  //   }

  //   return d3.drag()
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended);
  // }




  const startCanvas = (ctx, width = 600, height = 800) => {

    const w2 = width / 2,
      h2 = height / 2,
      nodeRadius = 5;

    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      return d => scale(d.group);
    }


    function forceSimulation(width, height) {
      return d3.forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().id(d => d.id));
    }

    function findNode(nodes, x, y, radius) {
      const rSq = radius * radius;
      let i;
      for (i = nodes.length - 1; i >= 0; --i) {
        const node = nodes[i],
          dx = x - node.x,
          dy = y - node.y,
          distSq = (dx * dx) + (dy * dy);
        if (distSq < rSq) {
          return node;
        }
      }
      // No node selected
      return undefined;
    }

    const dd = [...data.nodes, ...Array(5000).fill(Math.random().toString()).map(c => ({ id: c }))]
    // console.log(dd)
    // const links = data.links.map(d => Object.create(d));
    const nodes = dd.map(d => Object.create(d));
    const edges = data.links.map(d => Object.assign({}, d));


    // const w2 = width / 2,
    //   h2 = height / 2,
    //   nodeRadius = 5;

    // const ctx = DOM.context2d(width, height);
    const canvas = ctx.canvas;

    const simulation = forceSimulation(width, height);
    let transform = d3.zoomIdentity;

    // // The simulation will alter the input data objects so make
    // // copies to protect the originals.
    // const nodes = data.nodes.map(d => Object.assign({}, d));
    // const edges = data.links.map(d => Object.assign({}, d));

    d3.select(canvas)
      .call(d3.drag()
        // Must set this in order to drag nodes. New in v5?
        .container(canvas)
        .subject(dragSubject)
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded))
      .call(d3.zoom()
        .scaleExtent([1 / 10, 8])
        .on('zoom', zoomed));

    simulation.nodes(nodes)
      .on("tick", simulationUpdate);
    simulation.force("link")
      .links(edges);

    function zoomed(event) {
      transform = event.transform;
      simulationUpdate();
    }

    /** Find the node that was clicked, if any, and return it. */
    function dragSubject(event) {
      const x = transform.invertX(event.x),
        y = transform.invertY(event.y);
      const node = findNode(nodes, x, y, nodeRadius);
      if (node) {
        node.x = transform.applyX(node.x);
        node.y = transform.applyY(node.y);
      }
      // else: No node selected, drag container
      return node;
    }

    function dragStarted(event) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = transform.invertX(event.x);
      event.subject.fy = transform.invertY(event.y);
    }

    function dragged(event) {
      event.subject.fx = transform.invertX(event.x);
      event.subject.fy = transform.invertY(event.y);
    }

    function dragEnded(event) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }
    function canvas_arrow(context, fromx, fromy, tox, toy) {
      const headlen = 5; // length of head in pixels
      const dx = tox - fromx;
      const dy = toy - fromy;
      const angle = Math.atan2(dy, dx);
      context.moveTo(fromx, fromy);
      context.lineTo(tox, toy);
      context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
      context.moveTo(tox, toy);
      context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }

    function interpolate(a, b, frac) // points A and B, frac between 0 and 1
    {
      var nx = a.x + (b.x - a.x) * frac;
      var ny = a.y + (b.y - a.y) * frac;
      return { x: nx, y: ny };
    }

    function simulationUpdate() {
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);
      // Draw edges
      edges.forEach(function (d) {
        ctx.beginPath();
        ctx.moveTo(d.source.x, d.source.y);
        ctx.lineTo(d.target.x, d.target.y);
        // ctx.bezierCurveTo(
        //   d.source.x,
        //   d.source.y,
        //   (d.source.x + d.target.x) / 2 + 30,
        //   ((d.source.y + d.target.y) / 2) + 30,
        //   d.target.x,
        //   d.target.y
        // );
        // ctx.quadraticCurveTo(
        //   ((d.source.x + d.target.x) / 2) + 30,
        //   ((d.source.y + d.target.y) / 2) + 30,
        //   d.target.x,
        //   d.target.y
        // );


        ctx.lineWidth = Math.sqrt(d.value);
        ctx.strokeStyle = '#aaa';
        ctx.stroke();

        const { x, y } = interpolate(d.target, d.source, 0.2)
        canvas_arrow(ctx, d.source.x, d.source.y, x, y)
      });
      // Draw nodes
      nodes.forEach(function (d, i) {
        ctx.beginPath();
        // Node fill
        ctx.moveTo(d.x + nodeRadius, d.y);
        ctx.arc(d.x, d.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = color(d);
        ctx.fill();
        // Node outline
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = '1.5'
        ctx.stroke();
      });
      //   node.append("text")
      //   .attr("x", 8)
      //   .attr("y", "0.31em")
      //   .text(d => d.id)
      // .clone(true).lower()
      //   .attr("fill", "none")
      //   .attr("stroke", "white")
      //   .attr("stroke-width", 3);
      nodes.forEach(function (d, i) {
        ctx.font = '12px serif';
        ctx.fillStyle = "#fff";
        ctx.fillText('Hello world', d.x - 20, d.y - 10);
      })
      ctx.restore();
    }
  }

  // const svgRef = useCallback((svg) => {
  //   if (!svg) return
  //   console.log('ground graph', svg)
  //   startCanvas(svg, 1000, 400)
  // }, [])

  const svgRef = useCallback((canvas) => {
    if (!canvas) return

    // const ctx = DOM.context2d(width, height);

    const ctx = canvas.getContext('2d')

    // console.log('ground graph', svg)
    startCanvas(ctx)
  }, [])


  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <div style={{ border: 'dashed 2px royalBlue', }}>
        {/* <svg
          // style={{
          //   width: '100%',
          //   height: 'calc(var(--height-main) - 4px)',
          //   background: 'inherit',

          // }}
          // width={'100%'}
          ref={svgRef}
        /> */}
        <canvas id='canvas' ref={svgRef} width={500} height={500}></canvas>
      </div>
    </div>
  )
}

export default App
