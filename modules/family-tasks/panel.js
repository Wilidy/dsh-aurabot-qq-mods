// 家人代办面板：开关 + 家人名单 + 待办列表。
// call('/path') 走 /aurabot/api/ext/family-tasks/<path>。

return function FamilyTasksPanel({ toast }) {
  const [status, setStatus] = React.useState(null)
  const [busy, setBusy] = React.useState(false)

  const load = () => {
    call('/status')
      .then(setStatus)
      .catch(() => setStatus(null))
  }
  React.useEffect(() => {
    load()
  }, [])

  const reload = () => {
    setBusy(true)
    call('/reload')
      .then(() => {
        toast && toast('配置已重新载入')
        load()
      })
      .catch((e) => toast && toast('出错：' + e.message))
      .finally(() => setBusy(false))
  }

  const pending = (status && status.pending) || []
  const total = (status && status.total) || 0

  return h(
    'div',
    { style: { padding: 12, maxWidth: 720 } },

    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 } },
      h('h3', { style: { margin: 0 } }, '家人代办'),
      h(
        'button',
        {
          onClick: load,
          style: { marginLeft: 'auto', padding: '4px 12px' },
        },
        '刷新',
      ),
    ),

    h(
      'div',
      {
        style: {
          background: '#f6f8fa',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          fontSize: 13,
          lineHeight: 1.7,
        },
      },
      h('div', null, '状态：', status ? (status.enabled ? '运行中' : '已关闭') : '读取中…'),
      h('div', null, '家人 QQ：', status ? status.familyCount + ' 个' : '—'),
      h('div', null, '主人 QQ：', status ? status.owner || '未填' : '—'),
      h('div', null, '流水总数：', total + ' 条'),
      h(
        'div',
        { style: { marginTop: 8, color: '#666' } },
        '名单、主人 QQ、提醒间隔在模块设置里改，改完点下面按钮重新载入。',
      ),
      h(
        'button',
        {
          onClick: reload,
          disabled: busy,
          style: { marginTop: 8, padding: '4px 12px' },
        },
        busy ? '载入中…' : '重新载入配置',
      ),
    ),

    h('h4', { style: { margin: '16px 0 8px' } }, '最近待办'),
    pending.length === 0
      ? h('div', { style: { color: '#888', fontSize: 13 } }, '暂无待办')
      : h(
          'div',
          null,
          pending.map((t) =>
            h(
              'div',
              {
                key: t.id,
                style: {
                  borderBottom: '1px solid #eee',
                  padding: '8px 0',
                  fontSize: 13,
                },
              },
              h(
                'div',
                null,
                h('b', null, t.speaker || '家人'),
                ' · ',
                t.kind,
                ' · ',
                new Date(t.at).toLocaleString('zh-CN'),
              ),
              h('div', { style: { marginTop: 4 } }, t.text),
            ),
          ),
        ),
  )
}
