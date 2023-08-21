const PROTO_PATH = __dirname + "\\proto\\first_project.proto";
const util = require('util')
const grpc = require("@grpc/grpc-js"); // * https://www.npmjs.com/package/@grpc/grpc-js
const proto_loader = require("@grpc/proto-loader") // * https://www.npmjs.com/package/@grpc/proto-loader
const packageDefinition = proto_loader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)
const firstProject  = grpc.loadPackageDefinition(packageDefinition)
const client = new firstProject.FirstProject("0.0.0.0:50051", grpc.credentials.createInsecure());
const readlineSync = require('readline-sync'); // * https://www.npmjs.com/package/readline-sync
  
async function sendMessage(payload){
    return await new Promise((res, rej) => {
        client.channelMsg(payload, (err, resServer) => {   
            if(err) res("")
            else res(resServer.msg)
        })  
    })
}


(async () => {
    while(true){
        const cmd = await readlineSync.question("[+] Client: ");
        const json = {msg: cmd}
        if(cmd.trim() === "exit" || cmd.trim() === "by") {
            await sendMessage({msg: "Client ended the communication!"})
            process.exit()
        }else{
            const res = await sendMessage(json)
            if(res === "") {
                console.log(`   [+] Server not response...`);
                process.exit()
            }
            else console.log(`   [+] Server: ${Buffer.from(res, 'latin1')}\n`);
        }
    }
})()