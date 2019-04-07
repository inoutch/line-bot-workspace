import express from "express";
import line, {MessageEvent} from "@line/bot-sdk";

(() => {
    const channelAccessToken = process.env.LINE_ACCESS_TOKEN;
    const channelSecret = process.env.LINE_CHANNEL_SECRET;

    if (channelSecret == undefined || channelAccessToken == undefined) {
        return;
    }

    const lineConfig = {channelAccessToken, channelSecret};
    const bot = new line.Client(lineConfig);
    const app = express();

    app.post("/bot/webhook", line.middleware(lineConfig), async (req, res) => {
        res.status(200);

        const promises = req.body.events.map((event: MessageEvent) =>
            bot.replyMessage(event.replyToken, {type: "text", text: "テスト"}));
        await Promise.all(promises);
    });

    app.listen(process.env.PORT || 3000);
})();
