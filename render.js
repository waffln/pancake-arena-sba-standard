/* eslint-env node */

const fs = require("fs")
const path = require("path")

const pug = require("pug")
const sass = require("node-sass")

const pugFilePath = path.join(__dirname, "sba.pug")

/*
  careful, the pretty option is "deprecated" and might be removed in the future,
  but increases readability for comprehending or debugging the resulting HTML code.
  if something breaks, try removing this option which will result in compressed HTML
*/
const htmlCode = pug.renderFile(pugFilePath, {pretty: true})

const htmlDestinationPath = path.join(__dirname, "sba.html")

fs.writeFile(htmlDestinationPath, htmlCode, (err) => {
  if (err)
    throw err

  console.log(`Wrote HTML successfully to ${htmlDestinationPath}`)
})

const sassCode = path.join(__dirname, "css", "main.sass")

sass.render({
  file: sassCode,
  outputStyle: "expanded" // uncompressed CSS for better readability
}, (err, result) => {
  if (err)
    throw err

  const cssDestinationPath = path.join(__dirname, "css", "style.css")
  fs.writeFile(cssDestinationPath, result.css, (err) => {
    if (err)
      throw err

    console.log(`Wrote CSS successfully to ${cssDestinationPath}`)
  })
})
