import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              BusNoti
            </h1>
            <p className="text-sm text-text-secondary">
              실시간 버스 도착 알림 서비스
            </p>
          </div>

          {/* Register Card */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                회원가입
              </h2>

              {/* Register Form */}
              <RegisterForm />

              {/* Divider */}
              <Divider label="또는" className="my-6" />

              {/* Social Login */}
              <SocialLoginButtons />
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-muted">
        © 2026 BusNoti. All rights reserved.
      </footer>
    </div>
  );
}
