import tls from "tls"

const client = tls.connect({
    host: "localhost",
    port: 8000,

    rejectUnauthorized: false
}, () => {

    console.log("Connected!");

    client.write("Hello Server");

});

client.on("data", (data) => {

    console.log(data.toString());

});