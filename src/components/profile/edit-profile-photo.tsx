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
  photoURL: z.string().url({ message: "অনুগ্রহ করে একটি সঠিক URL দিন।" }).optional(),
  photoFile: z.any().optional(),
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
      photoURL: currentUser.photoURL || '',
      photoFile: null,
    }
  });
  
  const { formState: { isSubmitting }, watch, setValue } = form;
  const currentPhotoUrl = watch('photoURL');
  const initials = currentUser.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('photoFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        setValue('photoURL', ''); // Clear URL field when file is selected
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit: SubmitHandler<ProfilePhotoFormData> = async (data) => {
    if (!firestore || !auth) return;
    const user = auth.currentUser;
    if (!user) return;

    let finalPhotoURL = data.photoURL;

    // If a file is selected, upload it first
    if (data.photoFile) {
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
                <AvatarImage src={filePreview || currentPhotoUrl || '/placeholder.png'} alt={currentUser.name} />
                <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
            </Avatar>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="photoURL"
            render={({ field }) => (
                <FormItem>
                <FormLabel>ছবির URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} disabled={!!watch('photoFile')} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-muted-foreground"></div>
              <span className="flex-shrink mx-4 text-muted-foreground text-sm">অথবা</span>
              <div className="flex-grow border-t border-muted-foreground"></div>
            </div>

            <FormField
              control={form.control}
              name="photoFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ছবি আপলোড করুন</FormLabel>
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
