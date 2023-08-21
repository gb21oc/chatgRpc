const PROTO_PATH = __dirname + "\\proto\\first_project.proto";
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
const readlineSync = require('readline-sync');


function getServer() {
    const server = new grpc.Server();
    server.addService(firstProject.FirstProject.service, {
        ChannelMsg: ChannelMsg
    })
    return server;
}

const routeServer = getServer();
routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("[+] Server Runnning :)");
    if(error) console.log(error);
    routeServer.start();
});

async function ChannelMsg(call, callback){
    const msg = call.request.msg
    if(msg.includes("ended")){
        console.clear();
        console.log("---------------------------------");
        console.log(`   [+] ${msg}`);    
        console.log("---------------------------------");
        callback(null, {msg: "exit"});
    }else{
        console.log(`   [+] Client: ${msg}\n`);
        const cmd = await readlineSync.question("[+] Server: ");
        callback(null, {msg: cmd});
    }
}

