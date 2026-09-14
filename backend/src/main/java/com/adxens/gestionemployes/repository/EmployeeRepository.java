package com.adxens.gestionemployes.repository;

import com.adxens.gestionemployes.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {

    @Query("SELECT DISTINCT e.department FROM Employee e ORDER BY e.department")
    List<String> findDistinctDepartments();
}
