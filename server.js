import tls from "tls"
import fs from "fs"
import { Socket } from "dgram";

const options = {
    key : fs.readFileSync("server.key"),
    cert : fs.readFileSync("server.crt")

};

const server = tls.createServer(options, (Socket)=>{

    console.log("Client Connected!");

    console.log("TLS Version:", Socket.getProtocol());

    console.log("Cipher:", Socket.getCipher());

    Socket.write("Welcome!\n");

    Socket.on("data", (data) => {

        console.log("Received:", data.toString());

        Socket.write("Echo: " + data);

    });
});


server.listen(8000, () => {

    console.log("TLS Server running on port 8000");

});