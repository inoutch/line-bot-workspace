import express from "express";
import * as line from "@line/bot-sdk";
import {MessageEvent} from "@line/bot-sdk";

function run() {
    const channelAccessToken = process.env.LINE_ACCESS_TOKEN;
    const channelSecret = process.env.LINE_CHANNEL_SECRET;

    if (channelSecret == undefined || channelAccessToken == undefined) {
        console.error("set environment variables [LINE_ACCESS_TOKEN, LINE_CHANNEL_SECRET]");
        return;
    }

    const lineConfig = {channelAccessToken, channelSecret};
    const bot = new line.Client(lineConfig);
    const app = express();

    app.get("/", async (req, res) => {
        await res.send("Hello world!");
    });

    app.post("/bot/webhook", line.middleware(lineConfig), async (req, res) => {
        res.status(200);

        const promises = req.body.events.map((event: MessageEvent) =>
            bot.replyMessage(event.replyToken, {type: "text", text: "テスト"}));
        await Promise.all(promises);
    });

    app.listen(process.env.PORT || 3000);
}

try {
    run();
} catch (e) {
    console.error(e);
}
