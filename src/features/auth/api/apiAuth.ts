import { supabase } from '@/services/supabase';
import { supabaseUrl } from '@/utils/constants';

// User signup
export async function signUpApi({
   email,
   password,
   fullName,
}: {
   email: string;
   password: string;
   fullName: string;
}) {
   const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
         data: {
            fullName,
            company: '',
            department: '',
            team: '',
            teamRole: '',
            avatar: '',
         },
      },
   });

   if (error) {
      console.error(error);
      throw new Error('User could not be signed up');
   }
   return data;
}

// sign in a user
export async function loginAPI({
   email,
   password,
}: {
   email: string;
   password: string;
}) {
   const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
   });

   if (error) {
      console.error(error);
      throw new Error('User could not be logged in');
   }
   return data;
}

export async function getCurrentUserAPI() {
   const { data: sessionData } = await supabase.auth.getSession();

   if (!sessionData.session) return null;

   const { data: data, error: userError } = await supabase.auth.getUser();

   if (userError) {
      console.error(userError);
      throw new Error('Could not get current user');
   }
   return data?.user;
}

// Update User Data
export async function updateUserAPI({
   fullName,
   password,
   avatar,
}: {
   fullName?: string;
   password?: string;
   avatar?: File | null;
}) {
   // 1-update fullname or password

   let updateData;
   if (password) updateData = { password };
   if (fullName) updateData = { ...updateData, data: { fullName } };
   if (!updateData) throw new Error('No data to update');

   const { data: userData, error: userError } =
      await supabase.auth.updateUser(updateData);
   if (!avatar) return userData;

   if (userError) {
      console.error(userError);
      throw new Error(`User could not be updated: ${userError.message}`);
   }
   // 2-upload avatar in the user
   const fileName = `avatar-${userData.user?.id}-${Math.random()}`;
   const { data: avatarData, error: avatarError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatar);
   if (avatarError) {
      console.error(avatarError);
      throw new Error(`Avatar could not be uploaded: ${avatarError.message}`);
   }

   // 3-update the avatar
   console.log(avatarData?.path);
   const { data: userDataWithAvatar, error: userError2 } =
      await supabase.auth.updateUser({
         data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
         },
      });

   if (userError2) {
      console.error(userError2);
      throw new Error(`User could not be updated: ${userError2.message}`);
   }
   return userDataWithAvatar;
}

// User logout
export async function LogOutAPI() {
   const { error } = await supabase.auth.signOut();
   if (error) {
      console.error(error);
      throw new Error('User could not be signed out');
   }
   return;
}
