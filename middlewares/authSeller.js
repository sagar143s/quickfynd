import prisma from '@/lib/prisma';



const authSeller = async (userId) => {
    try {
        if (!userId) return false;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { store: true },
        });
        if(user && user.store && user.store.status === 'approved'){
            return user.store.id;
        }
        return false;
    } catch (error) {
        console.log('[ORDER API DEBUG] authSeller error:', error);
        return false;
    }
}

export default authSeller