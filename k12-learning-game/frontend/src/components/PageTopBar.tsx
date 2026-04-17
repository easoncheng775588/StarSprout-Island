import { useState } from 'react';
import { PageBackLink } from './PageBackLink';
import { createChildProfile, updateChildProfile, updateParentActiveChild, type ChildProfileUpsertPayload } from '../api';
import { useSession } from '../session';

interface PageTopBarProps {
  backTo?: string;
  backLabel?: string;
}

const defaultChildForm = {
  nickname: '',
  title: '',
  stageLabel: '幼小衔接',
  avatarColor: '#8ecae6'
};

export function PageTopBar({ backTo, backLabel }: PageTopBarProps) {
  const { session, login, logout } = useSession();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChildId, setEditingChildId] = useState<number | null>(null);
  const [childNickname, setChildNickname] = useState(defaultChildForm.nickname);
  const [childTitle, setChildTitle] = useState(defaultChildForm.title);
  const [childStageLabel, setChildStageLabel] = useState(defaultChildForm.stageLabel);
  const [childAvatarColor, setChildAvatarColor] = useState(defaultChildForm.avatarColor);
  const [childFormError, setChildFormError] = useState('');
  const [switchError, setSwitchError] = useState('');
  const children = session?.children ?? [];
  const activeChild = children.find((child) => child.id === session?.childProfileId) ?? null;

  function resetChildForm() {
    setEditingChildId(null);
    setChildNickname(defaultChildForm.nickname);
    setChildTitle(defaultChildForm.title);
    setChildStageLabel(defaultChildForm.stageLabel);
    setChildAvatarColor(defaultChildForm.avatarColor);
    setChildFormError('');
  }

  function buildChildPayload(): ChildProfileUpsertPayload {
    return {
      nickname: childNickname.trim(),
      title: childTitle.trim(),
      stageLabel: childStageLabel,
      avatarColor: childAvatarColor
    };
  }

  function openCreateChildForm() {
    resetChildForm();
    setSwitchError('');
    setShowChildForm(true);
  }

  function openEditChildForm() {
    if (!activeChild) {
      return;
    }

    setEditingChildId(activeChild.id);
    setChildNickname(activeChild.nickname);
    setChildTitle(activeChild.title);
    setChildStageLabel(activeChild.stageLabel ?? defaultChildForm.stageLabel);
    setChildAvatarColor(activeChild.avatarColor ?? defaultChildForm.avatarColor);
    setChildFormError('');
    setSwitchError('');
    setShowChildForm(true);
  }

  async function handleSaveChildProfile() {
    if (!session) {
      return;
    }

    setChildFormError('');
    if (!childNickname.trim() || !childTitle.trim()) {
      setChildFormError('先把昵称和成长称号填写完整吧。');
      return;
    }

    try {
      const payload = buildChildPayload();

      if (editingChildId === null) {
        const createdChild = await createChildProfile(session.parentAccountId, payload);
        const nextChildren = [...children, createdChild];
        login({
          parentAccountId: session.parentAccountId,
          parentDisplayName: session.parentDisplayName,
          childProfileId: createdChild.id,
          childNickname: createdChild.nickname,
          children: nextChildren
        });
      } else {
        const updatedChild = await updateChildProfile(session.parentAccountId, editingChildId, payload);
        const nextChildren = children.map((child) => (child.id === updatedChild.id ? updatedChild : child));
        const currentChildId = session.childProfileId === updatedChild.id ? updatedChild.id : session.childProfileId;
        const currentChildNickname = session.childProfileId === updatedChild.id ? updatedChild.nickname : session.childNickname;

        login({
          parentAccountId: session.parentAccountId,
          parentDisplayName: session.parentDisplayName,
          childProfileId: currentChildId,
          childNickname: currentChildNickname,
          children: nextChildren
        });
      }

      resetChildForm();
      setShowChildForm(false);
      setShowSwitcher(false);
    } catch {
      setChildFormError(editingChildId === null ? '新档案没有保存成功，再试一次吧。' : '档案修改没有保存成功，再试一次吧。');
    }
  }

  async function handleSwitchChild(childId: number, childNickname: string) {
    if (!session) {
      return;
    }

    setSwitchError('');

    try {
      const response = await updateParentActiveChild(session.parentAccountId, childId);
      login({
        parentAccountId: response.parentAccountId,
        parentDisplayName: response.parentDisplayName,
        childProfileId: childId,
        childNickname,
        children: response.children
      });
    } catch {
      login({
        parentAccountId: session.parentAccountId,
        parentDisplayName: session.parentDisplayName,
        childProfileId: childId,
        childNickname,
        children: session.children
      });
      setSwitchError('孩子档案已经切换，本次没有成功同步到云端。');
    }

    setShowSwitcher(false);
  }

  return (
    <div className="page-top-bar">
      <div>
        {backTo && backLabel ? <PageBackLink label={backLabel} to={backTo} /> : null}
      </div>
      <div className="page-top-bar-actions">
        {session ? <span className="session-pill">当前小朋友：{session.childNickname}</span> : null}
        <button
          aria-expanded={showSwitcher}
          className="session-button session-button-secondary"
          onClick={() => setShowSwitcher((current) => !current)}
          type="button"
        >
          切换孩子
        </button>
        <button className="session-button" onClick={logout} type="button">
          退出登录
        </button>
      </div>
      {showSwitcher ? (
        <section className="child-switcher-panel">
          <p className="eyebrow">切换档案</p>
          <h2>选择要切换的小朋友</h2>
          <div className="child-switcher-grid">
            {children.map((child) => (
              <button
                aria-label={`切换到${child.nickname}`}
                className={`login-child-card ${session?.childProfileId === child.id ? 'login-child-card-selected' : ''}`}
                key={child.id}
                onClick={() => void handleSwitchChild(child.id, child.nickname)}
                type="button"
              >
                <strong>{child.nickname}</strong>
                <span>{child.title}</span>
                <span>连续学习 {child.streakDays} 天</span>
              </button>
            ))}
          </div>
          {switchError ? <p className="login-error">{switchError}</p> : null}
          <div className="login-child-tools">
            <button
              className="cta-button cta-button-secondary"
              onClick={openCreateChildForm}
              type="button"
            >
              新增孩子档案
            </button>
            {activeChild ? (
              <button
                className="cta-button cta-button-secondary"
                onClick={openEditChildForm}
                type="button"
              >
                编辑当前档案
              </button>
            ) : null}
          </div>
          {showChildForm ? (
            <section className="child-create-panel">
              <p className="eyebrow">{editingChildId === null ? '新增档案' : '编辑档案'}</p>
              <div className="login-form-grid">
                <label className="login-field">
                  <span>孩子昵称</span>
                  <input
                    aria-label="孩子昵称"
                    onChange={(event) => setChildNickname(event.target.value)}
                    placeholder="比如：小月亮"
                    type="text"
                    value={childNickname}
                  />
                </label>
                <label className="login-field">
                  <span>成长称号</span>
                  <input
                    aria-label="成长称号"
                    onChange={(event) => setChildTitle(event.target.value)}
                    placeholder="比如：森林观察员"
                    type="text"
                    value={childTitle}
                  />
                </label>
                <label className="login-field">
                  <span>学习阶段</span>
                  <select
                    aria-label="学习阶段"
                    onChange={(event) => setChildStageLabel(event.target.value)}
                    value={childStageLabel}
                  >
                    <option value="幼小衔接">幼小衔接</option>
                    <option value="一年级">一年级</option>
                  </select>
                </label>
                <label className="login-field">
                  <span>头像主题色</span>
                  <select
                    aria-label="头像主题色"
                    onChange={(event) => setChildAvatarColor(event.target.value)}
                    value={childAvatarColor}
                  >
                    <option value="#8ecae6">晴空蓝</option>
                    <option value="#ffcf70">暖阳黄</option>
                    <option value="#8ee1b5">草地绿</option>
                  </select>
                </label>
              </div>
              {childFormError ? <p className="login-error">{childFormError}</p> : null}
              <button className="cta-button login-button" onClick={() => void handleSaveChildProfile()} type="button">
                {editingChildId === null ? '保存孩子档案' : '保存档案修改'}
              </button>
            </section>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
