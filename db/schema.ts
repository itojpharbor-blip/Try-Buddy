import {sqliteTable,text,integer,index,uniqueIndex,primaryKey} from 'drizzle-orm/sqlite-core';
export const googleAccounts=sqliteTable('google_accounts',{
  googleSub:text('google_sub').primaryKey(),ownerId:text('owner_id').notNull(),createdAt:text('created_at').notNull(),
},t=>[uniqueIndex('idx_google_accounts_owner').on(t.ownerId)]);
export const authFlows=sqliteTable('auth_flows',{
  stateHash:text('state_hash').primaryKey(),codeVerifier:text('code_verifier').notNull(),nonce:text('nonce').notNull(),returnTo:text('return_to').notNull(),oldOwnerId:text('old_owner_id'),expiresAt:integer('expires_at').notNull(),
},t=>[index('idx_auth_flows_expires').on(t.expiresAt)]);
export const authSessions=sqliteTable('auth_sessions',{
  tokenHash:text('token_hash').primaryKey(),ownerId:text('owner_id').notNull(),email:text('email').notNull(),fullName:text('full_name'),expiresAt:integer('expires_at').notNull(),
},t=>[index('idx_auth_sessions_owner').on(t.ownerId),index('idx_auth_sessions_expires').on(t.expiresAt)]);
export const goals=sqliteTable('goals',{
  id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),name:text('name').notNull(),title:text('title').notNull(),
  firstStep:text('first_step').notNull(),progress:integer('progress').notNull().default(0),updates:text('updates').notNull().default('[]'),
  createdAt:text('created_at').notNull(),opportunityId:text('opportunity_id'),
  status:text('status').notNull().default('気になる'),memo:text('memo').notNull().default(''),
  nextAction:text('next_action').notNull().default(''),
  activityPeriod:text('activity_period').notNull().default(''),
  reminderHidden:integer('reminder_hidden',{mode:'boolean'}).notNull().default(false),
  publicActivity:integer('public_activity',{mode:'boolean'}).notNull().default(false),
  publicText:text('public_text').notNull().default(''),
  updatedAt:text('updated_at').notNull().default(''),
},t=>[index('idx_goals_created_at').on(t.createdAt),index('idx_goals_owner').on(t.ownerId),uniqueIndex('idx_goals_owner_opportunity').on(t.ownerId,t.opportunityId)]);
export const profiles=sqliteTable('profiles',{
  ownerId:text('owner_id').primaryKey(),nickname:text('nickname').notNull(),
  school:text('school').notNull().default(''),region:text('region').notNull().default(''),
  grade:text('grade').notNull().default(''),interests:text('interests').notNull().default('[]'),
  reminderDays:integer('reminder_days').notNull().default(7),updatedAt:text('updated_at').notNull(),
  bio:text('bio').notNull().default(''),
  dream:text('dream').notNull().default(''),
  publicId:text('public_id').unique(),
  profileVisible:integer('profile_visible',{mode:'boolean'}).notNull().default(false),
  dreamVisible:integer('dream_visible',{mode:'boolean'}).notNull().default(false),
  gradeVisible:integer('grade_visible',{mode:'boolean'}).notNull().default(false),
  regionVisible:integer('region_visible',{mode:'boolean'}).notNull().default(false),
});
export const follows=sqliteTable('follows',{
  followerId:text('follower_id').notNull(),
  targetId:text('target_id').notNull(),
  createdAt:text('created_at').notNull(),
},t=>[primaryKey({columns:[t.followerId,t.targetId]}),index('idx_follows_target').on(t.targetId)]);
export const reactions=sqliteTable('reactions',{
  ownerId:text('owner_id').notNull(),
  goalId:text('goal_id').notNull(),
  createdAt:text('created_at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.goalId]}),index('idx_reactions_goal').on(t.goalId)]);
export const officialVisits=sqliteTable('official_visits',{
  ownerId:text('owner_id').notNull(),
  opportunityId:text('opportunity_id').notNull(),
  visitedAt:text('visited_at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.opportunityId]}),index('idx_official_visits_recent').on(t.ownerId,t.visitedAt)]);
export const channelTopics=sqliteTable('channel_topics',{
  id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),category:text('category').notNull(),
  opportunityId:text('opportunity_id'),title:text('title').notNull(),body:text('body').notNull(),accessType:text('access_type').notNull().default('open'),createdAt:text('created_at').notNull(),
},t=>[index('idx_channel_topics_category_created').on(t.category,t.createdAt),index('idx_channel_topics_owner').on(t.ownerId)]);
export const channelReplies=sqliteTable('channel_replies',{
  id:text('id').primaryKey(),topicId:text('topic_id').notNull(),ownerId:text('owner_id').notNull(),
  body:text('body').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('idx_channel_replies_topic_created').on(t.topicId,t.createdAt),index('idx_channel_replies_owner').on(t.ownerId)]);
export const channelMembers=sqliteTable('channel_members',{
  topicId:text('topic_id').notNull(),ownerId:text('owner_id').notNull(),joinedAt:text('joined_at').notNull(),
},t=>[primaryKey({columns:[t.topicId,t.ownerId]}),index('idx_channel_members_owner').on(t.ownerId)]);
export const channelRequests=sqliteTable('channel_requests',{
  topicId:text('topic_id').notNull(),ownerId:text('owner_id').notNull(),createdAt:text('created_at').notNull(),
},t=>[primaryKey({columns:[t.topicId,t.ownerId]}),index('idx_channel_requests_owner').on(t.ownerId)]);
export const interestTags=sqliteTable('interest_tags',{
  name:text('name').primaryKey(),creatorId:text('creator_id').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('idx_interest_tags_creator').on(t.creatorId)]);
export const timelinePosts=sqliteTable('timeline_posts',{
  id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),body:text('body').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('idx_timeline_posts_created').on(t.createdAt),index('idx_timeline_posts_owner').on(t.ownerId)]);
export const timelineReactions=sqliteTable('timeline_reactions',{
  ownerId:text('owner_id').notNull(),postId:text('post_id').notNull(),createdAt:text('created_at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.postId]}),index('idx_timeline_reactions_post').on(t.postId)]);
export const timelineReplies=sqliteTable('timeline_replies',{
  id:text('id').primaryKey(),postId:text('post_id').notNull(),ownerId:text('owner_id').notNull(),body:text('body').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('idx_timeline_replies_post').on(t.postId,t.createdAt)]);
export const userBlocks=sqliteTable('user_blocks',{
  ownerId:text('owner_id').notNull(),targetId:text('target_id').notNull(),createdAt:text('created_at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.targetId]})]);
export const communityReports=sqliteTable('community_reports',{
  id:text('id').primaryKey(),reporterId:text('reporter_id').notNull(),kind:text('kind').notNull(),targetId:text('target_id').notNull(),reason:text('reason').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('idx_community_reports_created').on(t.createdAt)]);
export const dmThreads=sqliteTable('dm_threads',{
  id:text('id').primaryKey(),requesterId:text('requester_id').notNull(),recipientId:text('recipient_id').notNull(),accepted:integer('accepted',{mode:'boolean'}).notNull().default(false),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('idx_dm_threads_requester').on(t.requesterId,t.updatedAt),index('idx_dm_threads_recipient').on(t.recipientId,t.updatedAt)]);
export const dmMessages=sqliteTable('dm_messages',{
  id:text('id').primaryKey(),threadId:text('thread_id').notNull(),senderId:text('sender_id').notNull(),body:text('body').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('idx_dm_messages_thread').on(t.threadId,t.createdAt)]);
