
import React from 'react';
import {
    Globe, Facebook, Instagram, Github, Youtube,
    Linkedin, Twitter, Music, Send, MessageCircle,
    MessageSquare, Twitch
} from 'lucide-react';

export interface PlatformInfo {
    icon: any;
    label: string;
    color: string;
}

export const getPlatformInfo = (url: string): PlatformInfo => {
    const lowerUrl = url.toLowerCase();

    // Telegram - multiple patterns
    if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.me') || lowerUrl.includes('telegram.dog')) {
        return { icon: Send, label: 'Telegram', color: 'text-sky-500' };
    }

    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.me')) {
        return { icon: Facebook, label: 'Facebook', color: 'text-blue-500' };
    }

    if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
        return { icon: Instagram, label: 'Instagram', color: 'text-pink-500' };
    }

    if (lowerUrl.includes('github.com')) {
        return { icon: Github, label: 'GitHub', color: 'text-white' };
    }

    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        return { icon: Youtube, label: 'YouTube', color: 'text-red-500' };
    }

    if (lowerUrl.includes('linkedin.com')) {
        return { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' };
    }

    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
        return { icon: Twitter, label: 'Twitter', color: 'text-sky-400' };
    }

    if (lowerUrl.includes('spotify.com')) {
        return { icon: Music, label: 'Spotify', color: 'text-green-500' };
    }

    if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp.com')) {
        return { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-400' };
    }

    if (lowerUrl.includes('twitch.tv')) {
        return { icon: Twitch, label: 'Twitch', color: 'text-purple-500' };
    }

    if (lowerUrl.includes('discord.gg') || lowerUrl.includes('discord.com')) {
        return { icon: MessageSquare, label: 'Discord', color: 'text-indigo-500' };
    }

    return { icon: Globe, label: '', color: 'text-primary/30' };
};
