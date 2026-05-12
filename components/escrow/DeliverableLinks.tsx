'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Video, Globe, ChevronDown, ExternalLink, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateDeliverables } from '@/hooks/useProjectMetadata';
import type { EscrowMetadataRow } from '@/lib/supabase/types';

interface DeliverableLinksProps {
  pdaAddress: string;
  metadata: EscrowMetadataRow | null;
  isFreelancer: boolean;
}

const LINK_FIELDS = [
  {
    key: 'github_link' as const,
    label: 'GitHub Repository',
    placeholder: 'https://github.com/your-org/repo',
    icon: GitBranch,
    color: '#ffffff',
  },
  {
    key: 'loom_link' as const,
    label: 'Loom Demo Video',
    placeholder: 'https://www.loom.com/share/...',
    icon: Video,
    color: '#00eefc',
  },
  {
    key: 'live_url' as const,
    label: 'Live URL / Deployment',
    placeholder: 'https://your-project.vercel.app',
    icon: Globe,
    color: '#39ff14',
  },
] as const;

export function DeliverableLinks({ pdaAddress, metadata, isFreelancer }: DeliverableLinksProps) {
  const updateMutation = useUpdateDeliverables(pdaAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState({
    github_link: metadata?.github_link ?? '',
    loom_link: metadata?.loom_link ?? '',
    live_url: metadata?.live_url ?? '',
  });

  const hasAnyLink =
    metadata?.github_link || metadata?.loom_link || metadata?.live_url;

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      github_link: links.github_link.trim() || null,
      loom_link: links.loom_link.trim() || null,
      live_url: links.live_url.trim() || null,
    });
    setIsEditing(false);
  };

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
        {isFreelancer && !isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 text-xs border-white/[0.12] hover:bg-white/[0.04] gap-1.5"
          >
            <Plus className="size-3" />
            {hasAnyLink ? 'Edit Links' : 'Add Links'}
          </Button>
        )}
      </div>

      {/* Read-only view */}
      {!isEditing && (
        <div className="space-y-2">
          {LINK_FIELDS.map(({ key, label, icon: Icon, color }) => {
            const value = metadata?.[key];
            if (!value) return null;
            return (
              <motion.a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl group transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                whileHover={{ scale: 1.01, borderColor: `${color}33` }}
              >
                <Icon className="size-4 shrink-0" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </div>
                  <div className="text-xs text-foreground truncate">{value}</div>
                </div>
                <ExternalLink className="size-3 text-muted-foreground group-hover:text-[#00eefc] transition-colors shrink-0" />
              </motion.a>
            );
          })}

          {!hasAnyLink && !isFreelancer && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No deliverable links attached yet.
            </p>
          )}
          {!hasAnyLink && isFreelancer && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Add links to your GitHub repo, Loom demo, or live deployment.
            </p>
          )}
        </div>
      )}

      {/* Edit form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 overflow-hidden"
          >
            {LINK_FIELDS.map(({ key, label, placeholder, icon: Icon, color }) => (
              <div key={key}>
                <label className="label-caps block mb-1.5 flex items-center gap-1.5">
                  <Icon className="size-3" style={{ color }} />
                  {label}
                </label>
                <Input
                  value={links[key]}
                  onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="font-mono text-xs bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                />
              </div>
            ))}

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex-1 bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] font-semibold text-xs"
              >
                {updateMutation.isPending ? (
                  <><Loader2 className="size-3 animate-spin mr-1.5" /> Saving...</>
                ) : (
                  'Save Deliverables'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-white/[0.12] text-xs"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
