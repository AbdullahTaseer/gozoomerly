'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import WhatsappImg from "@/assets/svgs/whatsapp.png";
import { Check, Facebook, Instagram } from 'lucide-react';

type Props = {
  shareUrl: string;
  title?: string;
  className?: string;
};

const ShareButtons = ({ shareUrl, title, className }: Props) => {
  const [copied, setCopied] = useState(false);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title ? title + ' - ' : ''}${shareUrl}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(false);
    }
  };

  const isAbortError = (e: unknown) =>
    Boolean(e && typeof e === 'object' && 'name' in e && (e as { name: string }).name === 'AbortError');

  /**
   * Instagram does not offer a web “post this link” URL (unlike Facebook/WhatsApp).
   * - Phones: Web Share API so the user can pick **Instagram** and send the link there.
   * - Android fallback: SEND intent into the Instagram app with the text.
   * - iOS / desktop fallback: copy title + link, open Instagram, toast with paste steps.
   */
  const handleInstagramShare = async () => {
    const textForShare = title?.trim() ? `${title.trim()}\n${shareUrl}` : shareUrl;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isAndroid = /Android/i.test(ua);
    const isIOSDevice =
      /iPhone|iPad|iPod/i.test(ua) ||
      (typeof navigator !== 'undefined' &&
        navigator.platform === 'MacIntel' &&
        navigator.maxTouchPoints > 1);
    const isMobile = isAndroid || isIOSDevice;

    const sharePayload: ShareData = title?.trim()
      ? { title: title.trim(), text: `${title.trim()}\n${shareUrl}`, url: shareUrl }
      : { title: 'Zoomerly', text: shareUrl, url: shareUrl };

    if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
      const can =
        typeof navigator.canShare !== 'function' || navigator.canShare(sharePayload);
      if (can) {
        try {
          await navigator.share(sharePayload);
          return;
        } catch (e: unknown) {
          if (isAbortError(e)) return;
        }
      }
    }

    if (isAndroid) {
      const intentUrl =
        `intent:#Intent;action=android.intent.action.SEND;type=text/plain;` +
        `S.android.intent.extra.TEXT=${encodeURIComponent(textForShare)};` +
        `package=com.instagram.android;` +
        `S.browser_fallback_url=${encodeURIComponent('https://www.instagram.com/')};end`;
      window.location.href = intentUrl;
      toast.success('Finish sharing in Instagram.', { duration: 4000 });
      return;
    }

    if (isIOSDevice) {
      try {
        await navigator.clipboard.writeText(textForShare);
      } catch {
        /* ignore */
      }
      window.location.href = 'instagram://app';
      toast.success(
        'Link copied. In Instagram: start a Story → Link sticker — or paste into a DM.',
        { duration: 6500 },
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(textForShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    toast.success('Link copied. Paste it into a new post, story, or bio on Instagram.', {
      duration: 6500,
    });
  };

  return (
    <div className={`grid grid-cols-3 max-[500px]:grid-cols-2 gap-3 ${className || ''}`}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 h-[37px] bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
      >
        <Image src={WhatsappImg} height={32} alt='' />
        <span className="text-sm font-medium">WhatsApp</span>
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 h-[37px] bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
      >
        <Facebook size={18} />
        <span className="text-sm font-medium">Facebook</span>
      </a>
      <button
        type="button"
        onClick={handleInstagramShare}
        title="Share to Instagram (on your phone, pick Instagram in the share menu)"
        className={`flex items-center justify-center gap-2 px-4 py-2 h-[37px] rounded-lg transition-colors ${copied
          ? 'bg-green-500 text-white cursor-not-allowed'
          : 'bg-[#E1306C] text-white hover:bg-[#C91A56] cursor-pointer'
          }`}
      >
        {copied ? <Check size={18} /> : <Instagram size={18} />}
        <span className="text-sm font-medium">{copied ? 'Copied' : 'Instagram'}</span>
      </button>
    </div>
  );
};

export default ShareButtons;
