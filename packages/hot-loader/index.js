const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')

let watcher = chokidar.watch('./hotloader')
let hotloaderVars = []

let clearVars = () => {
  hotloaderVars.forEach(variable => {
    if (variable) {
      if (variable instanceof mp.Event) {
        variable.destroy()

      } else if (variable.type) {
        if (variable.type != 'player') {
          if (mp?.[variable.type +'s']?.exists(variable)) {
            variable.destroy()
          }
        }
      }
    }
  })
  hotloaderVars = []
}

let lastEval
watcher.on('ready', () => {
  console.log('Hot loader is watching for file changes in /hotloader :)')
  watcher.on('change', filePath => {
    if (path.extname(filePath) !== '.js') return
    // 1 sec delay to fix sending code twice
    if (lastEval && (Date.now() - lastEval) < 1000 ) return
    lastEval = Date.now()
    console.log(`Hot loader: Changed >> ${filePath}`)

    let file = fs.readFileSync(filePath)
    file = file.toString()

    if (path.dirname(filePath) === path.join('hotloader', 'server')) {
      try {
        clearVars()
        // remove comments
        file = file.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
        let matches = file.matchAll(/(let|var)\s+([^\s{].*) = .*/gi)
        matches = [...matches]
        let vars = []
        // parse variables
        matches.forEach(arr => vars.push(`typeof  ${arr[2]} != 'undefined' && ${arr[2]}`));

        file += `
        \n\n
        let _vars = [${vars}]
        _vars.forEach(_var => {
          if (_var) {
            hotloaderVars.push(_var)
          }
        })
        `
        eval(file)
      } catch (error) {
        console.error('[HOT LOADER] Error: ', error)
      }
      return

    } else if (path.dirname(filePath) !== path.join('hotloader', 'client')) {
      return
    }

    let players = []
    let execTo = file.match(/executeTo = \[(.*)\]/)
    file.replace(/executeTo = \[.*\];?/, '')
    if (execTo) {
      players = execTo[1].split(',')
      players = players.map(id => mp.players.at(parseInt(id))).filter(p => p != null)
    }

    if (players.length) {
      players.forEach(pl => pl.eval(`
        if (!hotloaderVars) {
          var hotloaderVars = []
          var hotloaderRender = null
          var hotloaderErrTimeout = null
          var cleanVars = () => {
            hotloaderVars.forEach(variable => {
              if (variable) {
                if (variable instanceof mp.Event) {
                  variable.destroy()

                } else if (variable.type) {
                  if (variable.type != 'player') {
                    if (mp?.[variable.type +'s']?.exists(variable)) {
                      variable.destroy()
                    }
                  }
                }
              }
            })
            hotloaderVars = []
          }

          var runhotcode = (code) => {
            try {
              if (hotloaderRender && hotloaderRender.destroy)
                hotloaderRender.destroy()
              cleanVars()
              let func = new Function(code)
              func()

            } catch (e) {
              hotloaderRender = new mp.Event('render', ()=> {
                mp.game.graphics.drawText('[hot-loader] Error: ', [0.15,0.35], {
                  font: 0,
                  scale: [0.65, 0.65],
                  color: [255,0,0,255]
                })
                mp.game.graphics.drawText(e, [0.25,0.40], {
                  font: 0,
                  scale: [0.40, 0.40],
                  color: [0,255,0,255]
                })
              })
              if (hotloaderErrTimeout) {
                clearTimeout(hotloaderErrTimeout)
              }
              hotloaderErrTimeout = setTimeout(()=> {
                hotloaderRender.destroy()
              }, 5000)
            }
          }
        }
      `))

      // remove comments
      file = file.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
      let matches = file.matchAll(/(let|var)\s+([^\s{].*) = .*/gi)
      matches = [...matches]
      let vars = []
      // parse variables
      matches.forEach(arr => vars.push(`typeof  ${arr[2]} != 'undefined' && ${arr[2]}`));
      file += `
      \n\n
      let _vars = [${vars}]
      _vars.forEach(_var => {
        if (_var) {
          hotloaderVars.push(_var)
        }
      })
      `
      players.forEach(pl => {
        pl.eval(`cleanVars()`)
        pl.eval(`runhotcode(\`${file}\`)`)
      })
    }
  })
})

function _import(path) {
  return import('../'+path)
}