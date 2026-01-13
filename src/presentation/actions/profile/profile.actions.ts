// filepath: src/presentation/actions/profile.actions.ts
'use server';

import { z } from 'zod';
import { createClient } from '@/infrastructure/utils/supabase/server';
import { createProfileService } from '@/application/di/container';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server'; // <--- IMPORT

export type ProfileFormState = {
  success: boolean;
  message: string;
  error?: string;
};

export async function updateProfileAction(
  prevState: ProfileFormState, 
  formData: FormData
): Promise<ProfileFormState> {
  // 1. OBTENIR TRADUCCIONS AL SERVIDOR
  const t = await getTranslations('profile');

  // 2. DEFINIR ESQUEMA ZOD (Dins de la funció per usar 't')
  const updateProfileSchema = z.object({
    userId: z.string().uuid(),
    username: z.string()
        .min(3, t('validation.username_min', { min: 3 }))
        .max(20, t('validation.username_max', { max: 20 })),
    avatarIcon: z.string().max(5, t('validation.avatar_invalid')) 
  });

  try {
    const rawData = {
      userId: formData.get('userId'),
      username: formData.get('username'),
      avatarIcon: formData.get('avatarIcon'),
    };

    const validatedData = updateProfileSchema.parse(rawData);

    const supabase = await createClient();
    const { updateUserProfile } = createProfileService(supabase);

    await updateUserProfile.execute(validatedData.userId, {
      username: validatedData.username,
      avatarIcon: validatedData.avatarIcon
    });

    revalidatePath('/profile');
    revalidatePath('/leaderboard');
    revalidatePath('/', 'layout');

    return { 
        success: true, 
        message: t('form.success_message'), // <--- Missatge traduït
        error: undefined 
    };

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      return { 
        success: false, 
        message: '', 
        error: zodError.issues[0]?.message || t('form.error_generic')
      };
    }
    
    console.error("Profile Update Error:", error);
    return { success: false, message: '', error: t('form.error_generic') };
  }
}