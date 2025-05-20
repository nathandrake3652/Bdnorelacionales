import { Asignatura } from "src/modules/asignatura/entities/asignatura.entity";
import { Evaluacion } from "src/modules/evaluacion/entities/evaluacion.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";


@Entity()
export class Profesor {
    @PrimaryColumn("uuid")
    nombre: string;
    @Column()
    asignaturas: Asignatura[];
    @Column()
    Disponibilidad: String;
    //@OneToMany(() => Evaluacion, (evaluacion) => evaluacion.profesor)
    //evaluaciones: Evaluacion[];
}