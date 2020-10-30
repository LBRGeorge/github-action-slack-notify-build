const { context } = require('@actions/github');

function buildSlackAttachments({ status, color, github }) {
  const { payload, ref, workflow, eventName } = github.context;
  const { owner, repo } = context.repo;
  const event = eventName;
  const branch = event === 'pull_request' ? payload.pull_request.head.ref : ref.replace('refs/heads/', '');

  const sha = event === 'pull_request' ? payload.pull_request.head.sha : github.context.sha;

  return [
    {
      color,
      mrkdwn_in: ['text'],
      title:
        event === 'pull_request'
          ? `<${payload.pull_request.html_url} | ${payload.pull_request.title}>`
          : `<https://github.com/${owner}/${repo}/commit/${sha} | ${branch}>`,
      text: event === 'pull_request' ? payload.pull_request.body : '',
      fields: [
        {
          title: 'Action',
          value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks | ${workflow}>`,
          short: true,
        },
        {
          title: 'Status',
          value: status,
          short: true,
        },
      ],
      footer_icon: 'https://github.githubassets.com/favicon.ico',
      footer: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
      ts: Math.floor(Date.now() / 1000),
    },
  ];
}

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
  return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;
