import express from "express";
import * as line from "@line/bot-sdk";
import {MessageEvent} from "@line/bot-sdk";

function run() {
    const app = express();

    app.use(express.static("./dst/static"));

    const channelAccessToken = process.env.LINE_ACCESS_TOKEN;
    const channelSecret = process.env.LINE_CHANNEL_SECRET;

    if (channelSecret != undefined && channelAccessToken != undefined) {
        console.info("applied line bot features");

        const lineConfig = {channelAccessToken, channelSecret};
        const bot = new line.Client(lineConfig);

        app.post("/bot/webhook", line.middleware(lineConfig), async (req, res) => {
            res.sendStatus(200);

            const promises = req.body.events.map((event: MessageEvent) =>
                bot.replyMessage(event.replyToken, {type: "text", text: "テスト"}));
            await Promise.all(promises);
        });
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.info(`Listening on port ${port}!`));
}

try {
    run();
} catch (e) {
    console.error(e);
}
