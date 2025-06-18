const { sequelize, User, Student, Teacher, Class, Course } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Synchroniser la base de données
    await sequelize.sync({ force: true });
    console.log('Base de données réinitialisée');

    // Créer un administrateur
    const adminUser = await User.create({
      email: 'admin@school.com',
      password: await bcrypt.hash('Admin123!', 10),
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin',
      isActive: true
    });

    // Créer quelques enseignants
    const teacherUsers = await Promise.all([
      User.create({
        email: 'prof.martin@school.com',
        password: await bcrypt.hash('Teacher123!', 10),
        firstName: 'Jean',
        lastName: 'Martin',
        role: 'teacher',
        isActive: true
      }),
      User.create({
        email: 'prof.dubois@school.com',
        password: await bcrypt.hash('Teacher123!', 10),
        firstName: 'Marie',
        lastName: 'Dubois',
        role: 'teacher',
        isActive: true
      })
    ]);

    const teachers = await Promise.all(teacherUsers.map((user, index) => 
      Teacher.create({
        userId: user.id,
        employeeId: `TCH${2023}${index + 1}`,
        specialization: index === 0 ? 'Mathématiques' : 'Français',
        subjects: index === 0 ? ['Mathématiques', 'Physique'] : ['Français', 'Histoire'],
        qualifications: [
          {
            degree: 'Master',
            institution: 'Université de Paris',
            year: 2018
          }
        ],
        contractType: 'full-time',
        status: 'active'
      })
    ));

    // Créer quelques élèves
    const studentUsers = await Promise.all([
      User.create({
        email: 'eleve.dupont@school.com',
        password: await bcrypt.hash('Student123!', 10),
        firstName: 'Thomas',
        lastName: 'Dupont',
        role: 'student',
        isActive: true
      }),
      User.create({
        email: 'eleve.durand@school.com',
        password: await bcrypt.hash('Student123!', 10),
        firstName: 'Sophie',
        lastName: 'Durand',
        role: 'student',
        isActive: true
      })
    ]);

    const students = await Promise.all(studentUsers.map((user, index) =>
      Student.create({
        userId: user.id,
        studentId: `STD${2023}${index + 1}`,
        dateOfBirth: new Date(2005, index, 1),
        grade: '6ème',
        enrollmentDate: new Date(),
        status: 'active',
        parentInfo: {
          father: {
            name: 'Jean Dupont',
            phone: '0123456789',
            email: 'jean.dupont@email.com'
          },
          mother: {
            name: 'Marie Dupont',
            phone: '0123456790',
            email: 'marie.dupont@email.com'
          }
        }
      })
    ));

    // Créer quelques classes
    const classes = await Promise.all([
      Class.create({
        name: '6ème A',
        grade: '6ème',
        academicYear: '2023-2024',
        mainTeacherId: teachers[0].id,
        capacity: 30,
        room: 'Salle 101',
        status: 'active'
      }),
      Class.create({
        name: '6ème B',
        grade: '6ème',
        academicYear: '2023-2024',
        mainTeacherId: teachers[1].id,
        capacity: 30,
        room: 'Salle 102',
        status: 'active'
      })
    ]);

    // Créer quelques cours
    const courses = await Promise.all([
      Course.create({
        name: 'Mathématiques 6ème',
        code: 'MATH6',
        subject: 'Mathématiques',
        teacherId: teachers[0].id,
        classId: classes[0].id,
        academicYear: '2023-2024',
        status: 'active',
        objectives: [
          'Maîtriser les opérations de base',
          'Comprendre les fractions',
          'Introduction à la géométrie'
        ]
      }),
      Course.create({
        name: 'Français 6ème',
        code: 'FRA6',
        subject: 'Français',
        teacherId: teachers[1].id,
        classId: classes[0].id,
        academicYear: '2023-2024',
        status: 'active',
        objectives: [
          'Améliorer l\'expression écrite',
          'Enrichir le vocabulaire',
          'Étude de textes littéraires'
        ]
      })
    ]);

    console.log('Données de test créées avec succès');
  } catch (error) {
    console.error('Erreur lors de la création des données de test:', error);
    process.exit(1);
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 