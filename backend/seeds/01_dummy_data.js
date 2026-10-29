const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('content_metrics').del();
  await knex('content_checklists').del();
  await knex('contents').del();
  await knex('channels').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  const [userId] = await knex('users').insert({
    name: 'Kreator Demo',
    email: 'creator@example.com',
    password_hash: passwordHash,
    role: 'creator',
  });

  const [channelYoutube] = await knex('channels').insert({
    user_id: userId,
    platform: 'youtube',
    handle_name: '@techcreator',
  });

  const [channelTiktok] = await knex('channels').insert({
    user_id: userId,
    platform: 'tiktok',
    handle_name: '@techcreator',
  });

  await knex('contents').insert([
    {
      user_id: userId,
      channel_id: channelYoutube,
      title: 'Tutorial Express untuk pemula',
      description: 'Membuat REST API pertama dengan Express',
      format_type: 'long_video',
      status: 'idea',
      priority: 'high',
    },
    {
      user_id: userId,
      channel_id: channelTiktok,
      title: 'Tips Git untuk tim',
      description: 'Tiga perintah Git yang sering dipakai',
      format_type: 'short_video',
      status: 'scripting',
      priority: 'medium',
    },
    {
      user_id: userId,
      channel_id: channelYoutube,
      title: 'Review hasil editing',
      description: 'Contoh konten yang sudah masuk tahap editing',
      format_type: 'long_video',
      status: 'editing',
      priority: 'low',
    },
  ]);
};