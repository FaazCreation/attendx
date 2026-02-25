'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DocXIcon } from '@/components/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

const registerSchema = z.object({
  memberId: z.string().min(1, { message: "সদস্য আইডি আবশ্যক।" }),
  name: z.string().min(1, { message: "নাম আবশ্যক।" }),
  email: z.string().email({ message: "অবৈধ ইমেইল ঠিকানা।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
  department: z.string().min(1, { message: "বিভাগ আবশ্যক।" }),
  session: z.string().min(1, { message: "সেশন আবশ্যক।" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        memberId: '',
        name: '',
        email: '',
        password: '',
        department: '',
        session: '',
    }
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if(!auth || !firestore) {
      toast({ variant: "destructive", title: "নিবন্ধন ব্যর্থ হয়েছে", description: "Firebase প্রস্তুত নয়।" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: data.name });

      const isAdmin = data.email.toLowerCase() === 'fh7614@gmail.com';
      const userRole = isAdmin ? 'Admin' : 'General Member';

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: data.memberId,
        uid: user.uid,
        name: data.name,
        email: data.email,
        department: data.department,
        batch: data.session,
        role: userRole,
        photoURL: '',
        eventParticipationScore: 0
      };
      
      await setDoc(userDocRef, userData);

      toast({
        title: "অ্যাকাউন্ট তৈরি হয়েছে!",
        description: "আপনি সফলভাবে নিবন্ধিত হয়েছেন।",
      });
      
      router.push('/login');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "নিবন্ধন ব্যর্থ হয়েছে",
        description: error.code === 'auth/email-already-in-use' 
            ? 'এই ইমেলটি ইতিমধ্যে নিবন্ধিত রয়েছে।'
            : 'একটি অজানা ত্রুটি ঘটেছে।',
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <DocXIcon className="mx-auto h-12 w-12 text-primary" />
        <div className='font-headline'>
          <CardTitle className="text-2xl font-bold">DocX</CardTitle>
          <CardDescription>
            Data Simplified
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>সদস্য আইডি</FormLabel>
                        <FormControl>
                            <Input placeholder="আপনার সদস্য আইডি" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>সম্পূর্ণ নাম</FormLabel>
                        <FormControl>
                            <Input placeholder="যেমনঃ জন ডো" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>ইমেইল</FormLabel>
                        <FormControl>
                            <Input placeholder="member@tcpc.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>পাসওয়ার্ড</FormLabel>
                         <div className="relative">
                            <FormControl>
                                <Input type={showPassword ? "text" : "password"} {...field} />
                            </FormControl>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>বিভাগ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="একটি বিভাগ নির্বাচন করুন" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>প্রফেশনাল</SelectLabel>
                                    <SelectItem value="Computer Science and Engineering">কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং</SelectItem>
                                    <SelectItem value="Bachelor of Business Administration">ব্যাচেলর অফ বিজনেস অ্যাডমিনিস্ট্রেশন</SelectItem>
                                    <SelectItem value="Theater and Media Studies">থিয়েটার অ্যান্ড মিডিয়া স্টাডিজ</SelectItem>
                                    <SelectItem value="Tourism and Hospitality Management">ট্যুরিজম অ্যান্ড হসপিটালিটি ম্যানেজমেন্ট</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>বিজ্ঞান</SelectLabel>
                                    <SelectItem value="Biochemistry and Molecular Biology">বায়োকেমিস্ট্রি অ্যান্ড মলিকুলার বায়োলজি</SelectItem>
                                    <SelectItem value="Physics">পদার্থবিজ্ঞান</SelectItem>
                                    <SelectItem value="Chemistry">রসায়ন</SelectItem>
                                    <SelectItem value="Botany">উদ্ভিদবিজ্ঞান</SelectItem>
                                    <SelectItem value="Mathematics">গণিত</SelectItem>
                                    <SelectItem value="Geography & Env.">ভূগোল ও পরিবেশ</SelectItem>
                                    <SelectItem value="Home Economics">হোম ইকোনমিক্স</SelectItem>
                                    <SelectItem value="Psychology">মনোবিজ্ঞান</SelectItem>
                                    <SelectItem value="Zoology">প্রাণিবিজ্ঞান</SelectItem>
                                    <SelectItem value="Statistics">পরিসংখ্যান</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>সমাজ বিজ্ঞান</SelectLabel>
                                    <SelectItem value="Economics">অর্থনীতি</SelectItem>
                                    <SelectItem value="Political Science">রাষ্ট্রবিজ্ঞান</SelectItem>
                                    <SelectItem value="Sociology">সমাজবিজ্ঞান</SelectItem>
                                    <SelectItem value="Social Work">সমাজকর্ম</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>কলা</SelectLabel>
                                    <SelectItem value="Bangla">বাংলা</SelectItem>
                                    <SelectItem value="English">ইংরেজি</SelectItem>
                                    <SelectItem value="History">ইতিহাস</SelectItem>
                                    <SelectItem value="Islamic History">ইসলামের ইতিহাস</SelectItem>
                                    <SelectItem value="Islamic Studies">ইসলামিক স্টাডিজ</SelectItem>
                                    <SelectItem value="Philosophy">দর্শন</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>ব্যবসায় শিক্ষা</SelectLabel>
                                    <SelectItem value="Accounting">হিসাববিজ্ঞান</SelectItem>
                                    <SelectItem value="Finance And Banking">ফিন্যান্স অ্যান্ড ব্যাংকিং</SelectItem>
                                    <SelectItem value="Management">ম্যানেজমেন্ট</SelectItem>
                                    <SelectItem value="Marketing">মার্কেটিং</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>সেশন</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="একটি সেশন নির্বাচন করুন" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="2020-2021">২০২০-২০২১</SelectItem>
                                <SelectItem value="2021-2022">২০২১-২০২২</SelectItem>
                                <SelectItem value="2022-2023">২০২২-২০২৩</SelectItem>
                                <SelectItem value="2023-2024">২০২৩-২০২৪</SelectItem>
                                <SelectItem value="2024-2025">২০২৪-২০২৫</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'অ্যাকাউন্ট তৈরি করা হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="underline hover:text-primary">
            সাইন ইন করুন
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}