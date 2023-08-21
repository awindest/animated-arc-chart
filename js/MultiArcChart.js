/*
╭━━╮╱╱╱╱╭╮╱╱╱╱╱╭╮╱╭╮╱╱╱╱╱╭╮            ━╮ ╭━
╰┫┣╯╱╱╱╱┃┃╱╱╱╱╭╯╰╮┃┃╱╱╱╱╱┃┃             | |
╱┃┃╭━╮╭━╯┣━━┳━┻╮╭╯┃┃╱╱╭━━┫╰━┳━━╮       ╱ o \
╱┃┃┃╭╮┫╭╮┃┃━┫━━┫┃╱┃┃╱╭┫╭╮┃╭╮┃━━┫      ╱_____\
╭┫┣┫┃┃┃╰╯┃┃━╋━━┃╰╮┃╰━╯┃╭╮┃╰╯┣━━┃     ╱    o  \  
╰━━┻╯╰┻━━┻━━┻━━┻━╯╰━━━┻╯╰┻━━┻━━╯    (__o______)  

Yet another science experiment from Indest Labs.

Recommend viewing in Visual Source Code.
*
*    MultiArcChart.js
*    
*/

class MultiArcChart {

  constructor(_parentElement) { //DOM element, data, options?
      
      this.parentElement = _parentElement

      this.initVis()
  }

  initVis() {      
        const vis = this
        vis.TAU = 2 * Math.PI; // http://TAUday.com/TAU-manifesto //candidate for a global variable
        vis.data = []
        vis.src = ['Oracle','Salesforce','Redshift','Delta_Lake','Kinesis','SAP','MySQL','S3','MariaDB','SQL_Server']
        vis.srcArray = Object.values(vis.src)
        vis.num_arcs = 10          // number of arcs to draw
        
        //vis.startAngle0 = new Array(vis.num_arcs).fill(0)
        vis.endAngle  = vis.TAU
        vis.startAngle = 0 //Math.PI //+ .7    // start angle of the arc
        vis.roundedness = 25         // amount of roundedness for arc beginnings and endings
        vis.MARGIN = { LEFT: 60, RIGHT: 50, TOP: 30, BOTTOM: 30 }
        vis.WIDTH = 980 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = 550 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

 //            .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
//            .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
           
        let width = 550 //960  //need to design whether or not to input width and heights
        let height = 550 //500

        vis.svg = d3.select(vis.parentElement).append('svg')
            .attr("width", width)
            .attr("height", height)
            .append("g").attr("transform", `translate( ${width / 2}, ${height / 2} )`) //move to center

        vis.svg.append('text')
            .attr('id','centerCounter')
            .attr('classed','centerCounter', true)
            // .attr('font-size', '48px' )
            // .attr('font-family', 'monospace')
            .attr('x', 3 )
            .attr('y', 19 )
            .attr('fill', 'black' ) // need to change color
            .attr('text-anchor', 'middle' )
            .style('font-size'  , '3em')
            .style('line-height', '1em') // set the distance between lines of text
            .style('font-weight', '900') // make it big
            // .attr('filter', 'url(#dropshadow)' )
            .text (0)
            .attr('title', 'this value reflects the average percent at a certain point in time')


        vis.arc_colors = ["#db2828", "#f2711c","#fbbd08", "#b5cc18", "#21ba45", "#00b5ad", "#2185d0", "#6435c9", "#a333c8", "#e03997", "#a5673f"
      ]
            
        vis.inner_radius = 35 //60
            
        vis.radius_width = 20 // 15
        
        vis.arc = d3.arc()
              .cornerRadius(vis.roundedness) // round the ends of the arcs
        
        vis.wrangleData()
    }

    wrangleData() {
      
      const vis = this
      for (let k=0; k < vis.num_arcs; k++) {
        vis.data.push({
                id: vis.srcArray[k],
                startAngle: 0,
                endAngle: vis.TAU,
                innerRadius: vis.inner_radius + k * vis.radius_width + 8,
                outerRadius: vis.inner_radius + 6 + (k + 1) * vis.radius_width,
                stroke: 10,
                fill: vis.arc_colors[k]
              })
      } // end of for loop
    //For the drop shadow filter, makes the overlapping arcs threeD
    const defs = vis.svg.append( 'defs' );

    const filter = defs.append( 'filter' )
          .attr( 'id', 'dropshadow' )

    filter.append( 'feGaussianBlur' )
          .attr( 'in', 'SourceAlpha' )
          .attr( 'stdDeviation', 2 )
          .attr( 'result', 'blur' );
    filter.append( 'feOffset' )
          .attr( 'in', 'blur' )
          .attr( 'dx', 2 )
          .attr( 'dy', 3 )
          .attr( 'result', 'offsetBlur' );

    const feMerge = filter.append( 'feMerge' );

    feMerge.append( 'feMergeNode' )
          .attr( 'in", "offsetBlur' )
    feMerge.append( 'feMergeNode' )
          .attr( 'in', 'SourceGraphic' );
    // end filter stuff

    vis.svg.selectAll(vis.parentElement)
        .data(vis.data)
        .join(
          (enter) => {
            return enter
              .append('path')
                // .attr('id', (d, i) => vis.parentElement + i)
                .attr('id', d => d.id)
                .attr('title', d => d.id)
                .style('fill', d => d.fill)
                .style('stroke', "#555")
                .attr('d', vis.arc)
                .attr('filter', 'url(#dropshadow)')
              .transition()
                .duration(2000) //need global variable for duration tied to animation speed
          },
          (update) => {
            return update
          },
          (exit) => {
            return exit.remove()
          }
    )
    } // end of wrangleData()
    
    updateVis(values) { //values is an object
      const vis = this
      // this worked but you can't update all of the arcs with the same value; need some 'd' segregation:
      // vis.x = vis.svg.selectAll('path[id]')
      // this didn't work: vis.x = vis.svg.selectAll('[id]')
  // design perhaps? -> vis.updateSingleArc(DOMElement, value[src])
  // calculate display score for center of multi-arc and call Counter Object
      const average = Object.values(values).reduce((avg, value, _, {
          length }) => {
          return avg + (value / length)
        }, 0)
      d3.select('#centerCounter')
        .transition()
        .delay( 0 )
        .duration(2000)
        .tween('text', vis.tweenText(scale.invert(average)) )
      
      for (let source of vis.src) { // iterate over all the sources
        vis.svg.select('#'+ source) // this was difficult to find how to do for some reason
            .transition()
            .duration(2000) //need global variable for duration tied to animation speed
            .attrTween('d', d => vis.arcTween(d, values[source]) ) // value in radians value[source]
      }
      
  } // end of updateVis()

    arcTween(d, new_endAngle) {
      const vis = this
      let interpolate_end = d3.interpolate(d.endAngle, new_endAngle)
        return (t) => {
          d.endAngle = interpolate_end(t)
          return vis.arc(d) 
      }
    } // end of arcTween()

    tweenText(newValue) {
      return function() {
        //let currentValue = +this.textContent
        let i = d3.interpolateRound(this.textContent, newValue )
        return function(t) {
          this.textContent = i(t);
        }
      }
    } // end of tweenText    

}
