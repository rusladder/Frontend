import { ecc_config, hash } from "../ecc"
import config from '../../app/config/public'
ecc_config.address_prefix = "GLS";

// let chain_id = ""
// for(let i = 0; i < 32; i++) chain_id += "00"
let chain_id = config.CHAIN_ID || "18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e"
console.log (chain_id, "CHAIN_ID")

module.exports = {
    address_prefix: "GLS",
    expire_in_secs: 15,
    chain_id
}
