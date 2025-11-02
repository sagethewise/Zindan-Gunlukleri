"use client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
    const supabase = createClientComponentClient();

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap veya Kayıt Ol</h1>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="light"
                providers={['github', 'google']} // İsteğe bağlı: Sosyal medya ile giriş
                redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
            />
        </div>
    );
}