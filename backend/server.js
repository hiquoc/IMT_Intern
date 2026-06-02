import "dotenv/config"
import app from "./app.js";
import connectToRedis from "./configs/redis.config.js";

const port = process.env.PORT || 3000;

async function bootstrap() {
    try {
        await connectToRedis();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.log("Failed to start the server: " + err);
        process.exit(1)
    }
}

bootstrap();


