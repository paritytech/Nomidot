import { BlockIndexCreateInput, prisma } from '../generated/prisma-client'

export function createBlockIndex(identifier: string, startFrom: number, index: number) {
    return prisma.createBlockIndex({
        identifier,
        startFrom,
        index,
    });
}

export function getBlockIndex(id: string) {
    return prisma.blockIndex({
        id
    })
}

export function updateBlockIndex(id: string) {

}


async function a () {
    const result = await prisma.createBlockIndex({
        identifier: 'nik',
        startFrom: 100,
        index: 100,
    });

    console.log(result);
}
