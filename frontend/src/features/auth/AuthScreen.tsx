import { FormEvent, useState } from 'react';
import { authApi } from 'shared/api/auth';
import { getErrorText } from 'shared/lib/format';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { Input } from 'shared/ui/Input';
import { useAuthStore } from 'app/store/auth-store';

type AuthMode = 'login' | 'register';

type AuthScreenProps = {
  bootError?: string | null;
};

export function AuthScreen({
  bootError = null,
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(bootError);
  const [submitting, setSubmitting] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response =
        mode === 'login'
          ? await authApi.login({ email, password })
          : await authApi.register({ email, fullName, password });

      setSession({
        token: response.accessToken,
        user: response.user,
      });
    } catch (submitError) {
      setError(getErrorText(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-screen__visual">
        <div className="auth-screen__gradient" />
        <div className="auth-screen__content">
          <span className="auth-screen__eyebrow">Трекер задач</span>
          <h1>Работа по задачам, без хаоса.</h1>
          <p>Пространства, проекты и обсуждение в одном потоке.</p>
          <div className="auth-screen__highlights">
            <Card>
              <strong>Старт за минуту</strong>
              <p>Создай пространство и сразу перейди к проектам.</p>
            </Card>
            <Card>
              <strong>Всё под рукой</strong>
              <p>Статус, исполнитель и обсуждение рядом с задачей.</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="auth-screen__panel">
        <Card className="auth-card">
          <div className="auth-card__switcher">
            <button
              className={
                mode === 'login'
                  ? 'auth-card__tab auth-card__tab--active'
                  : 'auth-card__tab'
              }
              onClick={() => setMode('login')}
              type="button"
            >
              Вход
            </button>
            <button
              className={
                mode === 'register'
                  ? 'auth-card__tab auth-card__tab--active'
                  : 'auth-card__tab'
              }
              onClick={() => setMode('register')}
              type="button"
            >
              Регистрация
            </button>
          </div>

          <div className="auth-card__header">
            <span className="auth-screen__eyebrow">Доступ</span>
            <h2>
              {mode === 'login'
                ? 'Войти в систему'
                : 'Создать аккаунт'}
            </h2>
            <p>
              {mode === 'login'
                ? 'Войди и продолжай работу.'
                : 'Создадим аккаунт и сразу откроем сессию.'}
            </p>
          </div>

          {error ? <ErrorMessage message={error} /> : null}

          <form className="auth-card__form" onSubmit={handleSubmit}>
            <Input
              autoComplete="email"
              label="Почта"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="team@company.ru"
              required
              type="email"
              value={email}
            />
            {mode === 'register' ? (
              <Input
                autoComplete="name"
                label="Имя"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Анна Смирнова"
                required
                value={fullName}
              />
            ) : null}
            <Input
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              label="Пароль"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
              required
              type="password"
              value={password}
            />
            <Button block disabled={submitting} type="submit">
              {submitting
                ? 'Подождите...'
                : mode === 'login'
                  ? 'Войти'
                  : 'Создать аккаунт'}
            </Button>
          </form>

          <div className="auth-card__tip">
            <strong>Подсказка</strong>
            <p>Создай второй аккаунт и добавь его по `userId`.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
