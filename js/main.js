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
*    main.js
*    
*/

// global variables

let arcs1 = new MultiArcChart("#arcchart-sources1")
// let arcs2 = new MultiArcChart("#arcchart-sources2")
// let arcs3 = new MultiArcChart("#arcchart-sources3")

const nTimeUnits = 10
const gTAU = 2*Math.PI // global constant

const scale = d3.scaleLinear() // map 0 - 100 to radians
    .domain([0, 100])
    .range([0, gTAU])

const i = d3.shuffle(d3.range(0, nTimeUnits, 5))
const src = ['Oracle','Salesforce','Redshift','Delta_Lake','Kinesis','SAP','MySQL','S3','MariaDB','SQL_Server']

function* generateIndex() { //generate an index number for all animations
    let index = 0
    while (index < nTimeUnits) {
        let reset = yield index += 1
        if (reset === 0) {
            index = 0
        }
    }
}
const iterator = generateIndex()
let max = 99
let min = 30

function update() {    
       let arcValues = []
       let value = iterator.next().value
       if (value > nTimeUnits - 1) {
           iterator.next(0)
           clearInterval(interval)
       }
       for (let source of src) {
            arcValues[source] = scale(Math.floor(Math.random() * (max - min + 1) + min))
       }
    //    console.log('ArcValues: ',arcValues, typeof(arcValues))

        updateAll(arcValues)
}
const interval = setInterval(update, 1500)
//updateAll()
updateAll = (value) => {
    // console.log('Updating with value of: ', value)
    arcs1.updateVis(value)
    // arcs2.updateVis(value)
    // arcs3.updateVis(value)
 
}
const zeroes = Array.from({ length: 10 }, () => ({ value: 0 })); //or Array.fill() 8)
// console.log(zeroes)

// create some dates
let date = Array.from({length: 365}, (_, i) => {
    const date = new Date(2023, 0, 1)
    date.setDate(i + 1) // daily

    return date
  })
// Between any two numbers
//Math.floor(Math.random() * (max - min + 1)) + min;

