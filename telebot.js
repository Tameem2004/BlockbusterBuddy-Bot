const TelegramBot=require('node-telegram-bot-api')
const axios=require('axios')

const bot=new TelegramBot('6735594191:AAF3k4XCfpnUvpOTa5FRl-ymZh6nLMKNLK4',{ polling: true })


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim();

    switch (messageText) {
        case '/start':
            bot.sendMessage(chatId, 'Welcome to MovieBot! Type /movie <movie name> to search for a movie.');
            break;
        default:
            if (messageText.startsWith('/movie')) {
                const movieName = messageText.substring(7).trim();
                if (movieName) {
                    searchMovie(chatId, movieName);
                } else {
                    bot.sendMessage(chatId, 'Please provide a movie name after /movie command.');
                }
            } else {
                bot.sendMessage(chatId, 'Invalid command. Type /start to see available commands.');
            }
            break;
    }
});

// Function to search for a movie
async function searchMovie(chatId, movieName) {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=777c1972c43e7bb98b13cd3399435b69&query=${movieName}`);
        const movie = response.data.results[0]; // Assuming the first result is the desired movie
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const message =
        `Title: ${movie.title}

        Overview: ${movie.overview}

        Release Date: ${movie.release_date}
        
        Image: ${imageUrl}`;
        bot.sendMessage(chatId, message);
    } catch (error) {
        bot.sendMessage(chatId, 'Error fetching movie information. Please try again later.');
    }
}