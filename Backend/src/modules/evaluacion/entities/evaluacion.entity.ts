import { Asignatura } from "src/modules/asignatura/entities/asignatura.entity";
import { Profesor } from "src/modules/profesor/entities/profesor.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Evaluacion {
  @PrimaryGeneratedColumn()
  id: number; // Llave primaria autogenerada

  //@ManyToOne(() => Profesor, (profesor) => profesor.evaluaciones)
 // profesor: Profesor;

  //@ManyToOne(() => Asignatura, (asignatura) => asignatura.evaluaciones)
  //asignatura: Asignatura;

  @Column()
  horario: string;

  @Column()
  duracion: number;

  @Column()
  alumnos: number;
}