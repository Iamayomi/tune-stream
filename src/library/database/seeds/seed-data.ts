// import { EntityManager } from 'typeorm';
// import { faker } from '@faker-js/faker';
// import { v4 as uuid4 } from 'uuid';
// import * as bcrypt from 'bcryptjs';

// import { Artist } from 'src/module/artists/artist.entity';
// import { Playlist } from 'src/module/playlists/playlist.entity';
// import { User } from 'src/module/users/user.entity';

// export const seedData = async (manager: EntityManager): Promise<void> => {
//   //   //1
//   // //   // Add your seeding logic here using the manager
//   // //   // For example:
//   // //   await seedUser();
//   // //   await seedArtist();
//   // //   await seedPlayLists();
//   // //   async function seedUser() {
//   // //     //2
//   // //     const salt = await bcrypt.genSalt();
//   // //     const encryptedPassword = await bcrypt.hash('123456', salt);
//   // //     const user = new User();
//   // //     user.firstName = faker.person.firstName();
//   // //     user.lastName = faker.person.lastName();
//   // //     user.email = faker.internet.email();
//   // //     user.password = encryptedPassword;
//   // //     user.apiKey = uuid4();
//   // //     await manager.getRepository(User).save(user);
//   // //   }
//   // //   async function seedArtist() {
//   // //     const salt = await bcrypt.genSalt();
//   // //     const encryptedPassword = await bcrypt.hash('123456', salt);
//   // //     const user = new User();
//   // //     user.firstName = faker.person.firstName();
//   // //     user.lastName = faker.person.lastName();
//   // //     user.email = faker.internet.email();
//   // //     user.password = encryptedPassword;
//   // //     user.apiKey = uuid4();
//   // //     const artist = new Artist();
//   // //     artist.user = user;
//   // //     artist.stageName = faker.person.zodiacSign();
//   // //     await manager.getRepository(User).save(user);
//   // //     await manager.getRepository(Artist).save(artist);
//   // //   }
//   // //   async function seedPlayLists() {
//   // //     const salt = await bcrypt.genSalt();
//   // //     const encryptedPassword = await bcrypt.hash('123456', salt);
//   // //     const user = new User();
//   // //     user.firstName = faker.person.firstName();
//   // //     user.lastName = faker.person.lastName();
//   // //     user.email = faker.internet.email();
//   // //     user.password = encryptedPassword;
//   // //     user.apiKey = uuid4();
//   // //     const playList = new Playlist();
//   // //     playList.name = faker.music.genre();
//   // //     playList.user = user;
//   // //     await manager.getRepository(User).save(user);
//   // //     await manager.getRepository(Playlist).save(playList);
//   // //   }
//   // // };
//   // export class SeedData {
//   //   constructor(public manager: EntityManager) {}
//   //   async seedUser(): Promise<void> {
//   //     const salt = await bcrypt.genSalt();
//   //     const encryptedPassword = await bcrypt.hash('123456', salt);
//   //     const user = new User();
//   //     user.firstName = faker.person.firstName();
//   //     user.lastName = faker.person.lastName();
//   //     user.email = faker.internet.email();
//   //     user.password = encryptedPassword;
//   //     // user.apiKey = uuid4();
//   //     await this.manager.getRepository(User).save(user);
//   //   }
//   //   async seedArtist(): Promise<void> {
//   //     const salt = await bcrypt.genSalt();
//   //     const encryptedPassword = await bcrypt.hash('123456', salt);
//   //     const user = new User();
//   //     user.firstName = faker.person.firstName();
//   //     user.lastName = faker.person.lastName();
//   //     user.email = faker.internet.email();
//   //     user.password = encryptedPassword;
//   //     // user.apiKey = uuid4();
//   //     const artist = new Artist();
//   //     artist.user = user;
//   //     await this.manager.getRepository(User).save(user);
//   //     await this.manager.getRepository(Artist).save(artist);
//   //   }
//   //   async seedPlayLists(): Promise<void> {
//   //     const salt = await bcrypt.genSalt();
//   //     const encryptedPassword = await bcrypt.hash('123456', salt);
//   //     const user = new User();
//   //     user.firstName = faker.person.firstName();
//   //     user.lastName = faker.person.lastName();
//   //     user.email = faker.internet.email();
//   //     user.password = encryptedPassword;
//   //     // user.apiKey = uuid4();
//   //     const playList = new Playlist();
//   //     playList.name = faker.music.genre();
//   //     playList.user = user;
//   //     await this.manager.getRepository(User).save(user);
//   //     await this.manager.getRepository(Playlist).save(playList);
//   //   }
// };

// // export default SeedData;
