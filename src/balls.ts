import { ClientToServerEvents } from "msgroom/types/socket.io";
import typia, { tags } from "typia";

const validation = typia.validate<{
    type: "text";
    content: string & tags.MinLength<1>;
    name: string & tags.MinLength<1> & tags.MaxLength<16>
}>({
    type   : "text",
    content: "fart",
    name: {
        tf: 4
    }
});

console.log(validation);