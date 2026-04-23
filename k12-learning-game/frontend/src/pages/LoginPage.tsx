import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createChildProfile,
  loginParent,
  registerParent,
  updateParentActiveChild,
  updateChildProfile,
  type AuthSessionData,
  type ChildProfileUpsertPayload,
  type SessionChildProfile
} from '../api';
import { useSession } from '../session';

const defaultChildForm = {
  nickname: '',
  title: '',
  stageLabel: '幼小衔接',
  avatarColor: '#8ecae6'
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [children, setChildren] = useState<SessionChildProfile[]>([]);
  const [parentAccountId, setParentAccountId] = useState<number | null>(null);
  const [parentDisplayName, setParentDisplayName] = useState('');
  const [parentDisplayNameInput, setParentDisplayNameInput] = useState('');
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChildId, setEditingChildId] = useState<number | null>(null);
  const [childNickname, setChildNickname] = useState(defaultChildForm.nickname);
  const [childTitle, setChildTitle] = useState(defaultChildForm.title);
  const [childStageLabel, setChildStageLabel] = useState(defaultChildForm.stageLabel);
  const [childAvatarColor, setChildAvatarColor] = useState(defaultChildForm.avatarColor);
  const [childFormError, setChildFormError] = useState('');

  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;

  function applyAuthSession(response: AuthSessionData) {
    setParentAccountId(response.parentAccountId);
    setParentDisplayName(response.parentDisplayName);
    setChildren(response.children);
    setSelectedChildId(response.children.some((child) => child.id === response.defaultChildId) ? response.defaultChildId : null);
  }

  function switchAuthMode(nextMode: 'login' | 'register') {
    setAuthMode(nextMode);
    setAuthError('');
  }

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
    setShowChildForm(true);
  }

  function openEditChildForm() {
    if (!selectedChild) {
      return;
    }

    setEditingChildId(selectedChild.id);
    setChildNickname(selectedChild.nickname);
    setChildTitle(selectedChild.title);
    setChildStageLabel(selectedChild.stageLabel ?? defaultChildForm.stageLabel);
    setChildAvatarColor(selectedChild.avatarColor ?? defaultChildForm.avatarColor);
    setChildFormError('');
    setShowChildForm(true);
  }

  async function handleParentLogin() {
    setAuthError('');

    try {
      const response: AuthSessionData = await loginParent(phone, password);
      applyAuthSession(response);
    } catch {
      setAuthError('手机号或密码不正确，再试一次吧。');
    }
  }

  async function handleParentRegister() {
    setAuthError('');

    if (!parentDisplayNameInput.trim() || !phone.trim() || !password.trim()) {
      setAuthError('先把家长称呼、手机号和密码填写完整吧。');
      return;
    }

    try {
      const response = await registerParent({
        displayName: parentDisplayNameInput.trim(),
        phone: phone.trim(),
        password: password.trim()
      });
      applyAuthSession(response);
    } catch {
      setAuthError('账号创建没有成功，再试一次吧。');
    }
  }

  async function handleSaveChildProfile() {
    if (parentAccountId === null) {
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
        const createdChild = await createChildProfile(parentAccountId, payload);
        const nextChildren = [...children, createdChild];
        setChildren(nextChildren);
        setSelectedChildId(createdChild.id);
      } else {
        const updatedChild = await updateChildProfile(parentAccountId, editingChildId, payload);
        setChildren(children.map((child) => (child.id === updatedChild.id ? updatedChild : child)));
      }

      resetChildForm();
      setShowChildForm(false);
    } catch {
      setChildFormError(editingChildId === null ? '新档案没有保存成功，再试一次吧。' : '档案修改没有保存成功，再试一次吧。');
    }
  }

  async function handleEnterWorld() {
    const currentSelectedChild = children.find((child) => child.id === selectedChildId);
    if (!currentSelectedChild || parentAccountId === null) {
      return;
    }

    let nextChildren = children;
    let nextParentDisplayName = parentDisplayName;

    try {
      const response = await updateParentActiveChild(parentAccountId, currentSelectedChild.id);
      nextChildren = response.children;
      nextParentDisplayName = response.parentDisplayName;
    } catch {
      // Keep local progress flowing even if the persistence request is temporarily unavailable.
    }

    login({
      parentAccountId,
      parentDisplayName: nextParentDisplayName,
      childProfileId: currentSelectedChild.id,
      childNickname: currentSelectedChild.nickname,
      children: nextChildren
    });
    navigate('/', { replace: true });
  }

  return (
    <main className="screen screen-login">
      <section className="login-card">
        <p className="eyebrow">学习小岛</p>
        <h1>欢迎回到学习小岛</h1>
        <p>
          继续今天的数学、语文和英语冒险，让每一次闯关都留下新的星星和徽章。
        </p>
        <p className="login-demo-tip">演示账号：13800000001 / demo1234</p>

        <div className="login-child-tools">
          <button
            aria-pressed={authMode === 'login'}
            className={`cta-button cta-button-secondary ${authMode === 'login' ? 'theme-selected-chip' : ''}`}
            onClick={() => switchAuthMode('login')}
            type="button"
          >
            登录已有账号
          </button>
          <button
            aria-pressed={authMode === 'register'}
            className={`cta-button cta-button-secondary ${authMode === 'register' ? 'theme-selected-chip' : ''}`}
            onClick={() => switchAuthMode('register')}
            type="button"
          >
            创建家长账号
          </button>
        </div>

        <div className="login-form-grid">
          {authMode === 'register' ? (
            <label className="login-field">
              <span>家长称呼</span>
              <input
                aria-label="家长称呼"
                onChange={(event) => setParentDisplayNameInput(event.target.value)}
                placeholder="比如：月亮妈妈"
                type="text"
                value={parentDisplayNameInput}
              />
            </label>
          ) : null}
          <label className="login-field">
            <span>家长手机号</span>
            <input
              aria-label="家长手机号"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="请输入家长手机号"
              type="tel"
              value={phone}
            />
          </label>
          <label className="login-field">
            <span>{authMode === 'login' ? '登录密码' : '设置密码'}</span>
            <input
              aria-label={authMode === 'login' ? '登录密码' : '设置密码'}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={authMode === 'login' ? '请输入登录密码' : '请设置登录密码'}
              type="password"
              value={password}
            />
          </label>
        </div>

        <button
          className="cta-button login-button"
          onClick={() => void (authMode === 'login' ? handleParentLogin() : handleParentRegister())}
          type="button"
        >
          {authMode === 'login' ? '登录查看孩子档案' : '立即创建账号'}
        </button>

        {authError ? <p className="login-error">{authError}</p> : null}

        {parentAccountId !== null ? (
          <div className="login-child-picker" aria-label="孩子档案选择">
            <p className="eyebrow">{parentDisplayName}，你好</p>
            <p className="eyebrow">
              {children.length > 0 ? '选择今天要出发的小朋友' : '先创建第一个孩子档案，马上开始今天的学习冒险。'}
            </p>
            <div className="login-child-grid">
              {children.map((child) => (
                <button
                  aria-label={`选择${child.nickname}`}
                  className={`login-child-card ${selectedChildId === child.id ? 'login-child-card-selected' : ''}`}
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  type="button"
                >
                  <strong>{child.nickname}</strong>
                  <span>{child.title}</span>
                  <span>连续学习 {child.streakDays} 天</span>
                </button>
              ))}
            </div>
            <div className="login-child-tools">
              <button
                className="cta-button cta-button-secondary"
                onClick={openCreateChildForm}
                type="button"
              >
                新增孩子档案
              </button>
              {selectedChild ? (
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
                      <option value="二年级">二年级</option>
                      <option value="三年级">三年级</option>
                      <option value="四年级">四年级</option>
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
                <button className="cta-button login-button" onClick={handleSaveChildProfile} type="button">
                  {editingChildId === null ? '保存孩子档案' : '保存档案修改'}
                </button>
              </section>
            ) : null}
          </div>
        ) : null}

        <div className="login-highlight-grid">
          <article className="login-highlight-card">
            <strong>数学岛</strong>
            <p>数感启蒙、20 以内加减法、规律思维</p>
          </article>
          <article className="login-highlight-card">
            <strong>语文岛</strong>
            <p>识字、拼音、笔画笔顺和汉字观察</p>
          </article>
          <article className="login-highlight-card">
            <strong>英语岛</strong>
            <p>字母、拼读、单词配对和绘本跟读</p>
          </article>
        </div>

        {parentAccountId !== null ? (
          <button className="cta-button login-button" onClick={() => void handleEnterWorld()} type="button">
            进入学习世界
          </button>
        ) : null}
      </section>
    </main>
  );
}
