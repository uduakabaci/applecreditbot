import { Bot, Context, session, SessionFlavor } from 'grammy';
import { conversations, createConversation, ConversationFlavor } from '@grammyjs/conversations';
import { environment } from 'core/libs/environment';
import { orderConversation } from './conversation';

type MyContext = Context & ConversationFlavor & SessionFlavor<SessionData>;

interface SessionData {
  conversationActive?: boolean;
}

const bot = new Bot<MyContext>(environment.TELEGRAM_BOT_TOKEN);

// Install session middleware
bot.use(session({ initial: (): SessionData => ({}) }));

// Install conversation middleware
bot.use(conversations());

// Register conversations
bot.use(createConversation(orderConversation, 'orderConversation'));

// Start command
bot.command('start', async (ctx) => {
  await ctx.conversation.enter('orderConversation');
});

// Default message handler
bot.on('message', async (ctx) => {
  if (!ctx.session.conversationActive) {
    await ctx.reply("Hi! Send /start to begin placing an order.");
  }
});

// Start the bot
console.log('Starting Apple Credit Bot...');
bot.start();