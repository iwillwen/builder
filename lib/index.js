/*
 * @file build
 * @author nighca <nighca@live.cn>
 */

const clean = require('./clean')
const webpack = require('./webpack')
const upload = require('./upload')

clean().then(
  () => console.info('[FEC] clean done.')
).then(
  () => webpack()
).then(
  () => console.info('[FEC] webpack done.')
).catch(
  e => {
    console.error(e)
    process.exit(1)
  }
)
