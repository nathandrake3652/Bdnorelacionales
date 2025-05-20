import { Evaluacion } from "src/modules/evaluacion/entities/evaluacion.entity";
import { Profesor } from "src/modules/profesor/entities/profesor.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class Asignatura {
    @PrimaryColumn("uuid")
    NRC: String;

    @Column()
    nombre: String;
    @Column()
    Horario: String;
    @Column()
    Alumnos: Number;
    @Column()
    AlumnosTea: Number;
    @Column()
    nivel: Number;
    //@ManyToMany(() => Profesor, (profesor) => profesor.asignaturas)
    //@JoinTable()
    //Profesores: Profesor[];
    //@OneToMany(() => Evaluacion, (evaluacion) => evaluacion.asignatura)
    //evaluaciones: Evaluacion[];
}
