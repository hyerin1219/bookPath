import type { NextConfig } from 'next';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'shopping-phinf.pstatic.net',
                port: '',
                pathname: '/**', // 모든 경로 허용
            },
            // 다른 이미지 호스트가 있다면 아래에 추가 가능
        ],
    },
};

export default nextConfig;
