package com.adxens.gestionemployes.entity;

/**
 * Les constantes sont volontairement en minuscules : elles doivent
 * correspondre exactement aux labels du type PostgreSQL "employee_status"
 * (voir V1__init_schema.sql). Employee#status est mappe avec
 * @JdbcTypeCode(SqlTypes.NAMED_ENUM), qui envoie le nom Java de la constante
 * (enum.name()) tel quel au driver. Renommer ces constantes en majuscules
 * casserait ce mapping et ferait echouer toute requete en base.
 */
public enum EmployeeStatus {
    active,
    inactive
}
