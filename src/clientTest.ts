import Client from "msgroom";

const client = new Client("balls user", "", {
    server: "http://localhost:4096",
});

client.on("message", message => void console.log(`[${message.author.nickname}] ${message.content}`));
client.on("nick-change", nickChange => void console.log(`Nick change: "${nickChange.oldNickname}" -> "${nickChange.newNickname}"`));
client.on("sys-message", sysMessage => void console.log(`System message: [${sysMessage.type}] ${sysMessage.message}`));
client.on("tag-add", tagAdd => void console.log(`${tagAdd.user.escapedName} got new tag: ${tagAdd.newTagLabel} (${tagAdd.newTag})`));
client.on("user-join", user => void console.log(`-> ${user.escapedName} joined :)`));
client.on("user-leave", user => void console.log(`<- ${user.escapedName} left :(`));
client.on("werror", reason => void console.log(`Received werror: ${reason}`));

await client.connect();
client.sendMessage("hi bye");