import React from 'react';
import ReactDOM from 'react-dom/client';
// icons.jsx — Heroicons-style outline/solid icons used across RExI
(function () {
  const S = ({ d, size = 24, sw = 1.6, fill = "none", stroke = "currentColor", children, vb = "0 0 24 24" }) => (
    <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}>
      {d ? <path d={d} /> : children}
    </svg>
  );

  const Icon = {
    home: (p) => <S {...p} d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0L22.28 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />,
    table: (p) => <S {...p}><rect x="3" y="4.5" width="18" height="15" rx="1.5" /><path d="M3 9.75h18M3 14.25h18M9 9.75V19.5" /></S>,
    server: (p) => <S {...p}><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M6.5 7.5h.01M6.5 16.5h.01" /></S>,
    chevron: (p) => <S {...p} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />,
    chevronRight: (p) => <S {...p} d="M8.25 4.5l7.5 7.5-7.5 7.5" />,
    check: (p) => <S {...p} d="M4.5 12.75l6 6 9-13.5" sw={p && p.sw ? p.sw : 2} />,
    checkSolid: (p) => <S {...p} fill="currentColor" stroke="none"><path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zm4.28 7.53l-5.25 6a.75.75 0 01-1.09.05l-2.75-2.75a.75.75 0 111.06-1.06l2.18 2.18 4.73-5.41a.75.75 0 011.12.99z" /></S>,
    exclaim: (p) => <S {...p} fill="currentColor" stroke="none"><path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM12 7a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1zm0 9.5a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z" /></S>,
    user: (p) => <S {...p}><circle cx="12" cy="8" r="3.75" /><path d="M4.5 20.25a7.5 7.5 0 0115 0" /></S>,
    bell: (p) => <S {...p} d="M14.857 17.082a23.85 23.85 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
    video: (p) => <S {...p}><rect x="2.5" y="6.5" width="13" height="11" rx="2" /><path d="M15.5 10.5l5-3v9l-5-3z" /></S>,
    cog: (p) => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M6 6l1.4 1.4M16.6 16.6L18 18M18 6l-1.4 1.4M7.4 16.6L6 18" /></S>,
    plus: (p) => <S {...p} d="M12 4.5v15M4.5 12h15" sw={p && p.sw ? p.sw : 2} />,
    sparkles: (p) => <S {...p} fill="currentColor" stroke="none"><path d="M12 2.5l1.6 4.4 4.4 1.6-4.4 1.6L12 14.5l-1.6-4.4L6 8.5l4.4-1.6L12 2.5zM5.5 14l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4L2.2 17.3l2.4-.9.9-2.4zM18 13.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" /></S>,
    headphones: (p) => <S {...p}><path d="M4 13v-1a8 8 0 1116 0v1" /><rect x="3" y="13" width="3.5" height="6" rx="1.5" /><rect x="17.5" y="13" width="3.5" height="6" rx="1.5" /></S>,
    x: (p) => <S {...p} d="M6 6l12 12M18 6L6 18" sw={p && p.sw ? p.sw : 2} />,
    pencil: (p) => <S {...p} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 7.125L16.875 4.5" />,
    calendar: (p) => <S {...p}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" /></S>,
    arrowUpRight: (p) => <S {...p} d="M6 18L18 6M9 6h9v9" />,
    send: (p) => <S {...p} fill="currentColor" stroke="none"><path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" /></S>,
    beaker: (p) => <S {...p} d="M9 3v6.5L4.5 18a2 2 0 001.8 3h11.4a2 2 0 001.8-3L15 9.5V3M8 3h8M7.5 14h9" />,
    doc: (p) => <S {...p}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5" /></S>,
    users: (p) => <S {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-4-5.66" /></S>,
    building: (p) => <S {...p}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h.01M14.99 7H15M9 11h.01M14.99 11H15M9 15h.01M14.99 15H15M10 21v-3.5h4V21" /></S>,
    tag: (p) => <S {...p}><path d="M3.5 7.5v4.7a2 2 0 00.6 1.4l7.8 7.8a2 2 0 002.8 0l4.7-4.7a2 2 0 000-2.8l-7.8-7.8a2 2 0 00-1.4-.6H5.5a2 2 0 00-2 2z" /><path d="M7.5 7.51h.01" /></S>,
    clipboard: (p) => <S {...p}><rect x="5" y="4.5" width="14" height="16" rx="2" /><path d="M9 4.5V3.5a1.5 1.5 0 013 0v1M9 4.5h6v1.5H9z" /><path d="M8.5 11h7M8.5 15h5" /></S>,
    mail: (p) => <S {...p}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></S>,
    bolt: (p) => <S {...p} fill="currentColor" stroke="none"><path d="M13 2L4.5 13.2c-.3.4 0 1 .5 1H11l-1 7c-.1.7.8 1.1 1.2.5L19.5 10.8c.3-.4 0-1-.5-1H13l1-7c.1-.7-.8-1.1-1.2-.5z" /></S>,
    lock: (p) => <S {...p}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 018 0v3" /></S>,
    upload: (p) => <S {...p} d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />,
    search: (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></S>,
    dots: (p) => <S {...p} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></S>,
    comment: (p) => <S {...p} d="M4 5.5h16a1 1 0 011 1v9a1 1 0 01-1 1H9l-4 3.5V16.5a1 1 0 01-1-1v-9a1 1 0 011-1z" />,
    peopleGroup: (p) => <S {...p}><circle cx="8.5" cy="9" r="2.6" /><circle cx="16" cy="9.5" r="2.2" /><path d="M3.5 19a5 5 0 0110 0M14 19a5 5 0 016.5-4.8" /></S>,
    board: (p) => <S {...p}><rect x="3.5" y="4.5" width="6.5" height="15" rx="1.4" /><rect x="14" y="4.5" width="6.5" height="10" rx="1.4" /></S>,
    tablev: (p) => <S {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><path d="M3.5 9.5h17M9.5 9.5V19.5M3.5 14.5h17" /></S>,
    listLines: (p) => <S {...p} d="M4 6h16M4 12h16M4 18h16" />,
    exclaimO: (p) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5M12 16h.01" /></S>,
    checkO: (p) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12l2.5 2.5 4.5-5" /></S>,
    plusCircle: (p) => <S {...p} fill="currentColor" stroke="none"><path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM13 11h3.5a1 1 0 010 2H13v3.5a1 1 0 01-2 0V13H7.5a1 1 0 010-2H11V7.5a1 1 0 012 0V11z" /></S>,
    paperclip: (p) => <S {...p} d="M16.5 6.5l-7 7a2.5 2.5 0 003.54 3.54l7.2-7.2a4.5 4.5 0 00-6.36-6.36l-7.2 7.2a6.5 6.5 0 109.2 9.2L21 16" />,
    download: (p) => <S {...p} d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4.5 19.5h15" />,
    eye: (p) => <S {...p}><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="3" /></S>,
    share: (p) => <S {...p}><circle cx="6" cy="12" r="2.5" /><circle cx="17.5" cy="6" r="2.5" /><circle cx="17.5" cy="18" r="2.5" /><path d="M8.2 10.8l7.1-3.6M8.2 13.2l7.1 3.6" /></S>,
    trash: (p) => <S {...p} d="M4 6.5h16M9 6.5V5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 5v1.5M6.5 6.5l.8 13a1.5 1.5 0 001.5 1.4h6.4a1.5 1.5 0 001.5-1.4l.8-13M10 11v6M14 11v6" />,
    reply: (p) => <S {...p} d="M9 7L4 12l5 5M4 12h11a5 5 0 015 5v1" />,
  };

  window.RExIcons = Icon;
})();
