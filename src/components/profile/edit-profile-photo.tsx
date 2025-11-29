'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState } from 'react';
import { uploadImage } from '@/firebase/storage';
import { Progress } from '../ui/progress';

const profilePhotoSchema = z.object({
  photoFile: z.any().refine(file => file, 'একটি ছবি আবশ্যক।'),
});

type ProfilePhotoFormData = z.infer<typeof profilePhotoSchema>;

interface EditProfilePhotoProps {
  currentUser: {
    uid: string;
    name: string;
    photoURL?: string;
  };
  onPhotoChanged: () => void;
}

export function EditProfilePhoto({ currentUser, onPhotoChanged }: EditProfilePhotoProps) {
  const { auth } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);


  const form = useForm<ProfilePhotoFormData>({
    resolver: zodResolver(profilePhotoSchema),
    defaultValues: {
      photoFile: null,
    }
  });
  
  const { formState: { isSubmitting }, watch, setValue } = form;
  const initials = currentUser.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('photoFile', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit: SubmitHandler<ProfilePhotoFormData> = async (data) => {
    if (!firestore || !auth) return;
    const user = auth.currentUser;
    if (!user) return;
    
    if (!data.photoFile) {
        toast({
            variant: "destructive",
            title: "কোনো ফাইল নির্বাচন করা হয়নি",
            description: "অনুগ্রহ করে একটি ছবি আপলোড করুন।",
        });
        return;
    }

    let finalPhotoURL = '';

    try {
        const downloadURL = await uploadImage(data.photoFile, `profile-photos/${user.uid}`, (progress) => {
            setUploadProgress(progress);
        });
        finalPhotoURL = downloadURL;
    } catch (error) {
        toast({
            variant: "destructive",
            title: "ফাইল আপলোড ব্যর্থ হয়েছে",
            description: "ছবিটি আপলোড করার সময় একটি সমস্যা হয়েছে।",
        });
        setUploadProgress(null);
        return;
    }
    
    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const updatedData = { photoURL: finalPhotoURL };

    updateDoc(userDocRef, updatedData)
      .then(() => {
        toast({
          title: "ছবি আপডেট হয়েছে",
          description: "আপনার প্রোফাইল ছবি সফলভাবে পরিবর্তন করা হয়েছে।",
        });
        setUploadProgress(null);
        onPhotoChanged();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
        setUploadProgress(null);
      });
  };

  return (
    <div className="space-y-4">
        <div className="flex justify-center">
            <Avatar className="h-32 w-32 border-4 border-primary/50">
                <AvatarImage src={filePreview || currentUser.photoURL || '/placeholder.png'} alt={currentUser.name} />
                <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
            </Avatar>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photoFile"
              render={() => (
                <FormItem>
                  <FormLabel>নতুন ছবি আপলোড করুন</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadProgress !== null && (
              <Progress value={uploadProgress} className="w-full" />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || uploadProgress !== null}>
            {isSubmitting || uploadProgress !== null ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
            </Button>
        </form>
        </Form>
    </div>
  );
}
